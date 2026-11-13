window.__ModuleLoader__.load({
  id: '@local/dsh-turn-navigator',
  factory() {
    return {
      apply(ctx) {
        // Keep DSH's history loading, previews, active turn and keyboard handling.
        // The localized accessible names identify the native rail in rc.5.
        ctx.effect(() => {
          const rail = 'nav:is([aria-label="轮次导航"],[aria-label="Turn navigation"])';
          const style = document.createElement('style');
          style.dataset.turnNavigatorPlugin = '';
          style.textContent = `
            ${rail} {
              left: 12px;
              right: auto;
              --turn-preview-height: 126px;
            }
            ${rail} button::before {
              left: 0;
              right: auto;
              transform-origin: 0;
            }
            ${rail} button:focus-visible::after {
              left: 0;
              right: auto;
            }
            ${rail} [role="tooltip"] {
              left: calc(100% + 10px);
              right: auto;
              width: min(380px, 100cqw - 70px);
              border: 1px solid var(--dsw-alias-border-l2);
            }
            @container (width > 480px) {
              ${rail} { display: block !important; }
            }
          `;
          document.head.appendChild(style);
          return () => style.remove();
        });
      }
    };
  }
});
