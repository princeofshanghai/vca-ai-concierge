import {
  ChatMessage,
  ChatMessageFeedbackFlow,
  ChatThread,
  Prompt,
  RecommendationCard,
} from "@/components/chat";
import { Button } from "@/components/primitives/button";
import {
  STARTER_PROMPTS,
  type FlowReview,
  type FlowReviewAvailabilityStep,
  type FlowReviewResourcesStep,
  type FlowReviewStep,
  shouldShowFlowReviewMessageFeedback,
} from "@/lib/conversation-flows";
import { getPrototypeMessageTimestamp } from "@/lib/prototype-timestamps";

type FlowReviewPageProps = Readonly<{
  flow: FlowReview;
}>;

function StarterPromptRow() {
  return (
    <div className="chat-message-enter flex w-full">
      <div className="flex max-w-[33rem] flex-wrap gap-sm pr-sm">
        {STARTER_PROMPTS.map((prompt) => (
          <Prompt key={prompt} prompt={prompt} />
        ))}
      </div>
    </div>
  );
}

function ResourceCards({ step }: { step: FlowReviewResourcesStep }) {
  return (
    <div className="chat-message-enter flex w-full">
      <div className="grid w-full max-w-[33rem] gap-md pr-sm sm:grid-cols-3">
        {step.resources.map((resource) => (
          <article
            key={resource.title}
            className="flex min-w-0 flex-col gap-md rounded-md border border-border-faint bg-background p-lg"
          >
            <div className="space-y-xs">
              <h2 className="text-heading-md text-text">{resource.title}</h2>
              <p className="text-body-xs text-text-meta">
                {resource.description}
              </p>
            </div>
            <Button
              size="small"
              variant="secondary"
              className="mt-auto w-fit px-pill-padding-inline"
            >
              {resource.actionLabel}
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}

function AvailabilityVariants({ step }: { step: FlowReviewAvailabilityStep }) {
  return (
    <div className="chat-message-enter flex w-full">
      <div className="flex w-full max-w-[33rem] flex-col gap-xl pr-sm">
        {step.variants.map((variant, index) => {
          const role = variant.role ?? "assistant";
          const showFeedback =
            role === "assistant" && variant.feedbackEligible === true;
          const timestamp = getPrototypeMessageTimestamp(index);

          return (
            <section key={variant.id} className="flex flex-col gap-md">
              <p className="text-body-xs text-text-meta">{variant.label}</p>
              <ChatMessage
                role={role}
                className={showFeedback ? "!pb-xs" : undefined}
              >
                {variant.message}
              </ChatMessage>
              {showFeedback ? (
                <ChatMessageFeedbackFlow timestamp={timestamp} />
              ) : null}
              <RecommendationCard
                title={variant.title}
                primaryAction={variant.primaryAction}
                secondaryAction={variant.secondaryAction}
              />
            </section>
          );
        })}
      </div>
    </div>
  );
}

function renderStep(step: FlowReviewStep, index: number) {
  if (step.kind === "message") {
    const showFeedback = shouldShowFlowReviewMessageFeedback(step);
    const timestamp = getPrototypeMessageTimestamp(index);

    return (
      <div key={step.id} className="contents">
        <ChatMessage
          role={step.role}
          className={showFeedback ? "!pb-xs" : undefined}
        >
          {step.content}
        </ChatMessage>
        {showFeedback ? <ChatMessageFeedbackFlow timestamp={timestamp} /> : null}
        {step.showStarterPromptsAfter ? <StarterPromptRow /> : null}
      </div>
    );
  }

  if (step.kind === "recommendation") {
    return (
      <RecommendationCard
        key={step.id}
        title={step.title}
        description={step.description}
        primaryAction={step.primaryAction}
        secondaryAction={step.secondaryAction}
      />
    );
  }

  if (step.kind === "resources") {
    return <ResourceCards key={step.id} step={step} />;
  }

  return <AvailabilityVariants key={step.id} step={step} />;
}

export function FlowReviewPage({ flow }: FlowReviewPageProps) {
  return (
    <main className="min-h-[calc(100dvh-7rem)] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfe_100%)]">
      <div className="mx-auto flex w-full max-w-[72rem] flex-col gap-[4.5rem] px-8 py-[4.75rem] sm:px-14 lg:px-28">
        <header className="space-y-sm">
          <p className="text-label-xs text-text-meta">Flow review</p>
          <h1 className="text-display-md text-text">{flow.title}</h1>
          <p className="max-w-[40rem] text-body-sm-open text-text-meta">
            {flow.description}
          </p>
        </header>

        <section
          aria-label={`${flow.label} conversation transcript`}
          className="border-t border-border-faint pt-xxxl"
        >
          <ChatThread className="mx-auto" timestamp="Today">
            {flow.steps.map(renderStep)}
          </ChatThread>
        </section>
      </div>
    </main>
  );
}
