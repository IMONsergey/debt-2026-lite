import { Component } from 'react';

/** A failed optional chunk must not take the conference page down with it. */
export class DialogBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="dialog-loading" role="alert">
        <p>Не удалось открыть окно. Обновите страницу и попробуйте ещё раз.</p>
        <button type="button" className="ui-button ui-button--secondary" onClick={this.props.onClose}>Закрыть</button>
      </div>
    );
  }
}
