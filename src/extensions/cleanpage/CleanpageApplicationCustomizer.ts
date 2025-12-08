import { Log } from "@microsoft/sp-core-library";
import { BaseApplicationCustomizer } from "@microsoft/sp-application-base";

import * as strings from "CleanpageApplicationCustomizerStrings";

const LOG_SOURCE: string = "CleanpageApplicationCustomizer";

export interface ICleanpageApplicationCustomizerProperties {
  testMessage: string;
}

export default class CleanpageApplicationCustomizer extends BaseApplicationCustomizer<ICleanpageApplicationCustomizerProperties> {
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    const currentUrl = window.location.href;
    const urlObj = new URL(currentUrl, window.location.origin);
    const path = urlObj.pathname.toLowerCase();

    const validPaths = ["/sites/comunicacoes-teste"];

    const isSeedPage = validPaths.includes(path);

    if (isSeedPage) {
      this.enableFocusMode();
    }

    return Promise.resolve();
  }

  private enableFocusMode(): void {
    const clickFocusButton = () => {
      const button = document.querySelector<HTMLButtonElement>(
        'button[data-automation-id="pageCommandBarFocusModeButton"]'
      );

      if (button && !button.dataset["focusModeClicked"]) {
        button.click();
        button.dataset["focusModeClicked"] = "true";
        Log.info(LOG_SOURCE, "Focus mode ativado pelo ApplicationCustomizer.");
      }
    };

    window.addEventListener("load", () => {
      clickFocusButton();
    });

    const observer = new MutationObserver(() => {
      clickFocusButton();

      const button = document.querySelector<HTMLButtonElement>(
        'button[data-automation-id="pageCommandBarFocusModeButton"]'
      );
      if (button && button.dataset["focusModeClicked"] === "true") {
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
}
