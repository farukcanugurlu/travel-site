import React from "react";

type Props = { children: React.ReactNode };
type State = { error: Error | null };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Konsola yazalım ki beyaz ekran yerine sebebi görülsün
    // İsterseniz burada Sentry/Log vb. entegre edebilirsiniz.
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Something went wrong while loading this page.</h2>
          <p style={{ opacity: 0.8 }}>{this.state.error.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
