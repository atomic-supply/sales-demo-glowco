/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../ui/collapsible";
import {
  AlertTriangle,
  AlertCircle,
  ChevronDown,
  ArrowRight,
  AlertOctagon,
} from "lucide-react";
import { theme } from "../../styles/theme/theme";
import type { InboxAlert } from "./types";

interface InboxBannerProps {
  alerts: InboxAlert[];
  onAlertAction?: (alert: InboxAlert) => void;
}

const bannerStyles = css`
  background: ${theme.colors.yellow100};
  border: 1px solid ${theme.colors.orange200};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.md};
  overflow: hidden;
  flex-shrink: 0;
`;

const triggerStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: ${theme.typography.fontFamily};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.gray800};

  &:hover {
    background: ${theme.colors.orange100};
  }
`;

const triggerLeftStyles = css`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const countBadgeStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: ${theme.colors.orange500};
  color: ${theme.colors.white};
  font-size: 11px;
  font-weight: ${theme.typography.fontWeight.semibold};
`;

const chevronStyles = (isOpen: boolean) => css`
  transition: transform 0.2s ease;
  transform: rotate(${isOpen ? "180deg" : "0deg"});
  color: ${theme.colors.gray500};
`;

const alertListStyles = css`
  padding: 0 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const alertRowStyles = css`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.gray200};
`;

const alertIconStyles = (severity: InboxAlert["severity"]) => {
  const colorMap = {
    critical: "#EF4444",
    warning: "#F59E0B",
    info: "#3B82F6",
  };
  return css`
    flex-shrink: 0;
    color: ${colorMap[severity]};
  `;
};

const alertTextStyles = css`
  flex: 1;
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray700};
  line-height: 1.4;
`;

const alertItemStyles = css`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.gray900};
`;

const alertActionStyles = css`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: 1px solid ${theme.colors.gray300};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.white};
  color: ${theme.colors.gray600};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  flex-shrink: 0;
  font-family: ${theme.typography.fontFamily};

  &:hover {
    background: ${theme.colors.gray50};
    border-color: ${theme.colors.gray400};
    color: ${theme.colors.gray800};
  }
`;

function SeverityIcon({ severity }: { severity: InboxAlert["severity"] }) {
  const size = 16;
  switch (severity) {
    case "critical":
      return <AlertOctagon size={size} />;
    case "warning":
      return <AlertTriangle size={size} />;
    case "info":
      return <AlertCircle size={size} />;
  }
}

export function InboxBanner({ alerts, onAlertAction }: InboxBannerProps) {
  const [open, setOpen] = useState(false);

  if (alerts.length === 0) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div css={bannerStyles}>
        <CollapsibleTrigger asChild>
          <button css={triggerStyles}>
            <span css={triggerLeftStyles}>
              <AlertTriangle size={16} color={theme.colors.orange500} />
              <span>
                <span css={countBadgeStyles}>{alerts.length}</span>
                {" "}
                {alerts.length === 1 ? "item needs" : "items need"} attention
              </span>
            </span>
            <ChevronDown size={16} css={chevronStyles(open)} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div css={alertListStyles}>
            {alerts.map((alert) => (
              <div key={alert.id} css={alertRowStyles}>
                <span css={alertIconStyles(alert.severity)}>
                  <SeverityIcon severity={alert.severity} />
                </span>
                <span css={alertTextStyles}>
                  {alert.message}
                  {" -- "}
                  <span css={alertItemStyles}>{alert.affectedItem}</span>
                </span>
                <button
                  css={alertActionStyles}
                  onClick={() => onAlertAction?.(alert)}
                >
                  Review <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
