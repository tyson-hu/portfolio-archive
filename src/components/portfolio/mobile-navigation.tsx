"use client";

import { ArrowUpRight } from "lucide-react";
import { useRef, useState, type MouseEvent } from "react";

import {
  resolvePortfolioNavigationHref,
  type PortfolioArea,
  type PortfolioNavigationItem,
  type PortfolioSectionHrefPrefix,
} from "@/data/portfolio";

type MobileNavigationProps = {
  items: readonly PortfolioNavigationItem[];
  sectionHrefPrefix: PortfolioSectionHrefPrefix;
  githubHref: string;
  currentArea?: PortfolioArea;
};

export function MobileNavigation({
  items,
  sectionHrefPrefix,
  githubHref,
  currentArea,
}: MobileNavigationProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const mobileItems = items.filter((item) =>
    item.surfaces.includes("mobile"),
  );

  const openDialog = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    setIsOpen(true);
  };

  const closeDialog = () => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) closeDialog();
  };

  return (
    <div className="portfolio-mobile-navigation">
      <button
        ref={triggerRef}
        className="portfolio-mobile-navigation__trigger"
        type="button"
        aria-controls="portfolio-mobile-dialog"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={openDialog}
      >
        Menu
      </button>

      <dialog
        ref={dialogRef}
        id="portfolio-mobile-dialog"
        className="portfolio-mobile-navigation__dialog"
        aria-labelledby="portfolio-mobile-navigation-title"
        onClose={handleDialogClose}
        onClick={handleBackdropClick}
      >
        <div className="portfolio-mobile-navigation__sheet">
          <div className="portfolio-mobile-navigation__heading">
            <h2 id="portfolio-mobile-navigation-title">Navigation</h2>
            <button
              className="portfolio-mobile-navigation__close"
              type="button"
              onClick={closeDialog}
            >
              Close
            </button>
          </div>

          <nav
            className="portfolio-mobile-navigation__links"
            aria-label="Mobile navigation"
          >
            {mobileItems.map((item) => {
              const isCurrent =
                currentArea === "work" &&
                item.kind === "section" &&
                item.label === "Work";

              return (
                <a
                  key={item.href}
                  href={resolvePortfolioNavigationHref(item, sectionHrefPrefix)}
                  target={item.kind === "external" ? "_blank" : undefined}
                  rel={
                    item.kind === "external"
                      ? "noopener noreferrer"
                      : undefined
                  }
                  aria-current={isCurrent ? "page" : undefined}
                  onClick={closeDialog}
                >
                  <span>{item.label}</span>
                  {item.kind === "external" ? (
                    <>
                      <ArrowUpRight size={16} aria-hidden="true" />
                      <span className="sr-only">
                        {" "}(opens in a new tab)
                      </span>
                    </>
                  ) : null}
                </a>
              );
            })}
            <a href={`${sectionHrefPrefix}#contact`} onClick={closeDialog}>
              Contact
            </a>
            <a
              href={githubHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeDialog}
            >
              <span>GitHub</span>
              <ArrowUpRight size={16} aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </nav>
        </div>
      </dialog>
    </div>
  );
}
