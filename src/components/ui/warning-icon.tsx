/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { AlertTriangle } from "lucide-react";
import { type FC } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { theme } from "../../styles";

export interface WarningIconProps {
  count: number;
  messages: string[];
}

/**
 * WarningIcon component for displaying warning indicators with tooltips.
 * Shows an alert triangle icon with an optional count badge when there are multiple warnings.
 * 
 * @param count - Number of warnings (0 hides the icon)
 * @param messages - Array of warning messages to display in the tooltip
 */
export const WarningIcon: FC<WarningIconProps> = ({ count, messages }) => {
  if (count === 0) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            css={css`
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 1rem;
              height: 1rem;
            `}
          >
            <AlertTriangle
              css={css`
                width: 0.875rem;
                height: 0.875rem;
                color: ${theme.colors.orange500};
                stroke-width: 2;
                fill: none;
                flex-shrink: 0;
              `}
            />
            {count > 1 && (
              <span
                css={css`
                  position: absolute;
                  top: -0.25rem;
                  right: -0.25rem;
                  background-color: ${theme.colors.orange500};
                  color: white;
                  border-radius: 50%;
                  width: 0.75rem;
                  height: 0.75rem;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 0.625rem;
                  font-weight: 600;
                  line-height: 1;
                `}
              >
                {count}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent
          css={css`
            max-width: 300px;
            white-space: pre-line;
          `}
        >
          {messages.join("\n\n")}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
