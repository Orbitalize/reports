import React, {ErrorInfo, PropsWithChildren} from "react";

interface ErrorBoundaryProps extends PropsWithChildren {}
type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
  errorStack: string;
};
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {hasError: false, error: null, errorStack: ""};
  }

  static getDerivedStateFromError(error: Error) {
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error)
    this.setState({error, errorStack: info.componentStack});
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <>
          <h2>Error: Unable to render the report</h2>
          <hr />
          <i>ErrorBoundary location</i>
          <br />
          <pre>{this.state.errorStack}</pre>
          <hr />
          <h3>{this.state.error?.message}</h3>
          <pre>{this.state.error?.stack}</pre>
        </>
      );
    }

    return this.props.children;
  }
}
