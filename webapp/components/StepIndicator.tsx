import type { StepIndicatorStepProps } from "@trussworks/react-uswds";
import classnames from "classnames";
import React, { type JSX } from "react";

export type StepStatusText = {
  complete: string;
  incomplete: string;
};

export type StepIndicatorProps = {
  showLabels?: boolean;
  counters?: "none" | "default" | "small";
  centered?: boolean;
  children: React.ReactElement<StepIndicatorStepProps>[];
  className?: string;
  divProps?: JSX.IntrinsicElements["div"];
  listProps?: JSX.IntrinsicElements["ol"];
  statusText?: StepStatusText;
  currentStepLabel?: string;
  lastUpdated?: string;
};

/**
 * Customized version of Trussworks' StepIndicator, minus the header (which we add ourselves
 * elsewhere).
 */
export const StepIndicator = (props: StepIndicatorProps): JSX.Element => {
  const {
    showLabels = true,
    counters = "none",
    centered = false,
    children,
    className,
    divProps,
    listProps,
    statusText = { complete: "completed", incomplete: "not completed", current: "current" },
  } = props;

  const { className: additionalDivClasses, ...remainingDivProps } = divProps || {};
  const { className: additionalListClasses, ...remainingListProps } = listProps || {};

  const divClasses = classnames(
    "usa-step-indicator",
    {
      "usa-step-indicator--no-labels": !showLabels,
      "usa-step-indicator--counters": counters === "default",
      "usa-step-indicator--counters-sm": counters === "small",
      "usa-step-indicator--center": centered,
    },
    className,
    additionalDivClasses,
  );

  const listClasses = classnames("usa-step-indicator__segments", additionalListClasses);

  const stepChildren = React.Children.map(children, (child) =>
    React.cloneElement(child, { statusText: statusText }),
  );

  return (
    <div className={divClasses} data-testid="step-indicator" {...remainingDivProps}>
      <ol className={listClasses} {...remainingListProps}>
        {stepChildren}
      </ol>
    </div>
  );
};
