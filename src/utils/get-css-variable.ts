export function getCssVariable(name: string, element: HTMLElement = document.documentElement): string {
    return getComputedStyle(element).getPropertyValue(name).trim();
}
