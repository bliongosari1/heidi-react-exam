import React, { useState } from 'react';

interface Shortcut {
  id: string;
  name: string;
  description: string;
  command: string;
}

interface FloatingAskHeidiProps {
  onCreateShortcut?: () => void;
  onViewAllShortcuts?: () => void;
}

const FloatingAskHeidi: React.FC<FloatingAskHeidiProps> = ({
  onCreateShortcut,
  onViewAllShortcuts,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSeeAllShortcuts = () => {
    if (onViewAllShortcuts) {
      onViewAllShortcuts();
    }
  };

  const handleCreateNewShortcut = () => {
    if (onCreateShortcut) {
      onCreateShortcut();
    }
  };

  return (
    <div className="floating-ask-heidi">
      <button
        className="floating-ask-heidi__trigger"
        onClick={handleToggle}
        aria-label="Ask Heidi"
      >
        <span className="floating-ask-heidi__icon">?</span>
      </button>

      {isOpen && (
        <div className="floating-ask-heidi__menu">
          <div className="floating-ask-heidi__header">
            <h3>Ask Heidi</h3>
          </div>

          <div className="floating-ask-heidi__actions">
            <button
              className="floating-ask-heidi__action-btn"
              onClick={handleSeeAllShortcuts}
            >
              See all shortcuts
            </button>

            <button
              className="floating-ask-heidi__action-btn"
              onClick={handleCreateNewShortcut}
            >
              Create new shortcut
            </button>
          </div>

          {shortcuts.length > 0 && (
            <div className="floating-ask-heidi__shortcuts-list">
              <h4>Your Shortcuts</h4>
              <ul>
                {shortcuts.map((shortcut) => (
                  <li key={shortcut.id} className="floating-ask-heidi__shortcut-item">
                    <span className="shortcut-name">{shortcut.name}</span>
                    <span className="shortcut-description">{shortcut.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingAskHeidi;
