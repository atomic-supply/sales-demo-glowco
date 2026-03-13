import { Suspense, type FC, type ReactNode } from "react";
import { PageLoader } from "./PageLoader";

interface LazyRouteProps {
  children: ReactNode;
}

// Wrap lazy component with Suspense
export const LazyRoute: FC<LazyRouteProps> = ({ children }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);
