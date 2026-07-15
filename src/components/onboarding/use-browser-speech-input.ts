"use client";

import { useCallback, useEffect, useRef } from "react";

type SpeechRecognitionAlternativeLike = Readonly<{
  transcript: string;
}>;

type SpeechRecognitionResultLike = Readonly<{
  length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}>;

type SpeechRecognitionResultListLike = Readonly<{
  length: number;
  [index: number]: SpeechRecognitionResultLike;
}>;

type SpeechRecognitionEventLike = Event &
  Readonly<{
    results: SpeechRecognitionResultListLike;
  }>;

type SpeechRecognitionErrorCode =
  | "aborted"
  | "audio-capture"
  | "bad-grammar"
  | "language-not-supported"
  | "network"
  | "no-speech"
  | "not-allowed"
  | "phrases-not-supported"
  | "service-not-allowed";

type SpeechRecognitionErrorEventLike = Event &
  Readonly<{
    error: SpeechRecognitionErrorCode;
  }>;

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onend: ((event: Event) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onspeechend: ((event: Event) => void) | null;
  onspeechstart: ((event: Event) => void) | null;
  onstart: ((event: Event) => void) | null;
  abort: () => void;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type SpeechRecognitionWindow = Window &
  typeof globalThis & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

export type BrowserSpeechInputError =
  | "microphone-blocked"
  | "microphone-unavailable"
  | "recognition-unavailable"
  | "unsupported-browser";

export type BrowserSpeechInputCallbacks = Readonly<{
  onError: (error: BrowserSpeechInputError) => void;
  onListening: () => void;
  onSpeechStart: () => void;
  onTranscript: (transcript: string) => void;
  onUtteranceEnd: (transcript: string) => void;
}>;

type ActiveRecognition = {
  recognition: SpeechRecognitionLike;
  shouldHandleEnd: boolean;
};

function getSpeechRecognitionConstructor() {
  if (typeof window === "undefined") {
    return undefined;
  }

  const speechWindow = window as SpeechRecognitionWindow;

  return (
    speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition
  );
}

function hasLiveAudioTrack(stream: MediaStream | null) {
  return Boolean(
    stream?.getAudioTracks().some((track) => track.readyState === "live"),
  );
}

function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

function classifyMediaError(error: unknown): BrowserSpeechInputError {
  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError" || error.name === "SecurityError") {
      return "microphone-blocked";
    }

    if (
      error.name === "NotFoundError" ||
      error.name === "NotReadableError" ||
      error.name === "AbortError"
    ) {
      return "microphone-unavailable";
    }
  }

  return "microphone-unavailable";
}

function classifyRecognitionError(
  error: SpeechRecognitionErrorCode,
): BrowserSpeechInputError | null {
  if (error === "aborted" || error === "no-speech") {
    return null;
  }

  if (error === "not-allowed" || error === "service-not-allowed") {
    return "microphone-blocked";
  }

  if (error === "audio-capture") {
    return "microphone-unavailable";
  }

  return "recognition-unavailable";
}

export function useBrowserSpeechInput(
  callbacks: BrowserSpeechInputCallbacks,
  language = "en-US",
) {
  const callbacksRef = useRef(callbacks);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const activeRecognitionRef = useRef<ActiveRecognition | null>(null);
  const transcriptRef = useRef("");
  const sessionVersionRef = useRef(0);

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  const setMicrophoneEnabled = useCallback((enabled: boolean) => {
    mediaStreamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = enabled;
    });
  }, []);

  const releaseMicrophone = useCallback(() => {
    stopStream(mediaStreamRef.current);
    mediaStreamRef.current = null;
  }, []);

  const abortRecognition = useCallback(() => {
    const activeRecognition = activeRecognitionRef.current;

    if (!activeRecognition) {
      return;
    }

    activeRecognition.shouldHandleEnd = false;
    activeRecognitionRef.current = null;

    try {
      activeRecognition.recognition.abort();
    } catch {
      // The browser may already have ended this recognition instance.
    }
  }, []);

  const startRecognition = useCallback(() => {
    const Recognition = getSpeechRecognitionConstructor();

    if (!Recognition) {
      callbacksRef.current.onError("unsupported-browser");
      return false;
    }

    if (!hasLiveAudioTrack(mediaStreamRef.current)) {
      callbacksRef.current.onError("microphone-unavailable");
      return false;
    }

    abortRecognition();
    setMicrophoneEnabled(true);
    transcriptRef.current = "";

    const recognition = new Recognition();
    const activeRecognition: ActiveRecognition = {
      recognition,
      shouldHandleEnd: true,
    };

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 1;
    activeRecognitionRef.current = activeRecognition;

    recognition.onstart = () => {
      if (activeRecognitionRef.current !== activeRecognition) {
        return;
      }

      callbacksRef.current.onListening();
    };

    recognition.onspeechstart = () => {
      if (activeRecognitionRef.current !== activeRecognition) {
        return;
      }

      callbacksRef.current.onSpeechStart();
    };

    recognition.onspeechend = () => {
      if (activeRecognitionRef.current !== activeRecognition) {
        return;
      }

      try {
        recognition.stop();
      } catch {
        // The browser may already be finishing this recognition instance.
      }
    };

    recognition.onresult = (event) => {
      if (activeRecognitionRef.current !== activeRecognition) {
        return;
      }

      let transcript = "";

      for (let index = 0; index < event.results.length; index += 1) {
        transcript += event.results[index]?.[0]?.transcript ?? "";
      }

      transcriptRef.current = transcript.trim();
      callbacksRef.current.onTranscript(transcriptRef.current);
    };

    recognition.onerror = (event) => {
      if (activeRecognitionRef.current !== activeRecognition) {
        return;
      }

      const error = classifyRecognitionError(event.error);

      if (!error) {
        return;
      }

      activeRecognition.shouldHandleEnd = false;
      activeRecognitionRef.current = null;
      setMicrophoneEnabled(false);

      if (error === "microphone-blocked") {
        releaseMicrophone();
      }

      callbacksRef.current.onError(error);
    };

    recognition.onend = () => {
      if (activeRecognitionRef.current === activeRecognition) {
        activeRecognitionRef.current = null;
      }

      setMicrophoneEnabled(false);

      if (!activeRecognition.shouldHandleEnd) {
        return;
      }

      callbacksRef.current.onUtteranceEnd(transcriptRef.current.trim());
    };

    try {
      recognition.start();
      return true;
    } catch {
      activeRecognition.shouldHandleEnd = false;
      activeRecognitionRef.current = null;
      setMicrophoneEnabled(false);
      callbacksRef.current.onError("recognition-unavailable");
      return false;
    }
  }, [abortRecognition, language, releaseMicrophone, setMicrophoneEnabled]);

  const requestPermissionAndStart = useCallback(async () => {
    const Recognition = getSpeechRecognitionConstructor();

    if (!Recognition) {
      callbacksRef.current.onError("unsupported-browser");
      return false;
    }

    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      callbacksRef.current.onError("microphone-unavailable");
      return false;
    }

    const sessionVersion = sessionVersionRef.current + 1;
    sessionVersionRef.current = sessionVersion;
    abortRecognition();
    releaseMicrophone();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      if (sessionVersionRef.current !== sessionVersion) {
        stopStream(stream);
        return false;
      }

      mediaStreamRef.current = stream;
      return startRecognition();
    } catch (error) {
      if (sessionVersionRef.current !== sessionVersion) {
        return false;
      }

      callbacksRef.current.onError(classifyMediaError(error));
      return false;
    }
  }, [abortRecognition, releaseMicrophone, startRecognition]);

  const resumeListening = useCallback(async () => {
    if (hasLiveAudioTrack(mediaStreamRef.current)) {
      return startRecognition();
    }

    return requestPermissionAndStart();
  }, [requestPermissionAndStart, startRecognition]);

  const finishSpeaking = useCallback(() => {
    const activeRecognition = activeRecognitionRef.current;

    if (!activeRecognition) {
      return false;
    }

    activeRecognition.shouldHandleEnd = true;

    try {
      activeRecognition.recognition.stop();
      return true;
    } catch {
      activeRecognition.shouldHandleEnd = false;
      activeRecognitionRef.current = null;
      setMicrophoneEnabled(false);
      return false;
    }
  }, [setMicrophoneEnabled]);

  const pauseListening = useCallback(() => {
    sessionVersionRef.current += 1;
    abortRecognition();
    setMicrophoneEnabled(false);
    transcriptRef.current = "";
  }, [abortRecognition, setMicrophoneEnabled]);

  const endSession = useCallback(() => {
    sessionVersionRef.current += 1;
    abortRecognition();
    releaseMicrophone();
    transcriptRef.current = "";
  }, [abortRecognition, releaseMicrophone]);

  useEffect(() => endSession, [endSession]);

  return {
    endSession,
    finishSpeaking,
    pauseListening,
    requestPermissionAndStart,
    resumeListening,
  };
}
