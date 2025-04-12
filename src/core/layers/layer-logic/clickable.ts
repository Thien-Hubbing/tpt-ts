export type ClickableType = {
  clickableName: string
  display: () => string
  unlocked: boolean | (() => boolean)
  isClickable: () => boolean
  onClick: () => void
};

export class Clickable {
  config: ClickableType;

  constructor(parameters: ClickableType) {
    this.config = parameters;
  }
};
