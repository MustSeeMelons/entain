// If we are locking/unlocking controls, there should be a minimum time to avoid flashing
export const UNLOCK_DELAY = 400;
// Appear/dissapear animation time
export const ANIMATION_DELAY = 350;

export const DEBOUNCE_AMOUNT = 400;

// Warning: Chaning this wont magically scale, must update `getDiscoverMovies` too!
export const API_PER_PAGE: number = 20;
export const OUR_PER_PAGE: number = 10;

export const PAGE_THRESHOLD = API_PER_PAGE / OUR_PER_PAGE;
