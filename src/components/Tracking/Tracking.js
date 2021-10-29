import * as ReactGA from "react-ga";

export const initGA = () => {
    ReactGA.initialize(process.env.REACT_APP_GA_ID);
};

export const PageView = () => {
    ReactGA.pageview(window.location.pathname +
        window.location.search);
};

/**
 * GAEvent - Add custom tracking event.
 * @param {string} category
 * @param {string} action
 * @param {string} label
 */
export const GAEvent = (category, action, label) => {
    ReactGA.event({
        category: category,
        action: action,
        label: label
    });
};