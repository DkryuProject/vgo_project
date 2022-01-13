const calcRem = (size) => `${size / 16}rem`;

const fontSizes = {
    small: calcRem(14),
    base: calcRem(16),
    lg: calcRem(18),
    xl: calcRem(20),
    xxl: calcRem(22),
    xxxl: calcRem(24),
    titleSize: calcRem(50),
};

const paddings = {
    small: calcRem(8),
    base: calcRem(10),
    lg: calcRem(12),
    xl: calcRem(14),
    xxl: calcRem(16),
    xxxl: calcRem(18),
};

const margins = {
    small: calcRem(8),
    base: calcRem(10),
    lg: calcRem(12),
    xl: calcRem(14),
    xxl: calcRem(16),
    xxxl: calcRem(18),
};

const interval = {
    base: calcRem(50),
    lg: calcRem(100),
    xl: calcRem(150),
    xxl: calcRem(200),
};

const verticalInterval = {
    base: `${calcRem(10)} 0 ${calcRem(10)} 0`,
};

const deviceSizes = {
    mobileS: '320px',
    mobileM: '375px',
    mobileL: '450px',
    tablet: '768px',
    tabletL: '1024px',
};

const colors = {
    black: '#000000',
    white: '#FFFFFF',
    gray_1: '#222222',
    gray_2: '#767676',
    green_1: '#3cb46e',
};

const device = {
    mobileS: `only screen and (max-width: ${deviceSizes.mobileS})`,
    mobileM: `only screen and (max-width: ${deviceSizes.mobileM})`,
    mobileL: `only screen and (max-width: ${deviceSizes.mobileL})`,
    tablet: `only screen and (max-width: ${deviceSizes.tablet})`,
    tabletL: `only screen and (max-width: ${deviceSizes.tabletL})`,
};

const fonts = {
    // h2: "font-weight: 900; font-size: 2.5rem",
    // h3: "font-weight: 700; font-size: 1.563rem",
    // h4: "font-weight: 700; font-size: 1.375rem",
    // h5: "font-weight: 700; font-size: 1rem",
    // h6: "font-weight: 700; font-size: 0.75rem",
    // display_1: "font-weight: 400; font-size: 0.688rem",
    // display_2: "font-weight: 400; font-size: 1rem",
    h2: 'font-weight: 600; font-size: 2.5rem',
    h3: 'font-weight: 400; font-size: 1.563rem',
    h4: 'font-weight: 400; font-size: 1.375rem',
    h5: 'font-size: 0.625rem',
    h6: 'font-weight: 600; font-size: 0.625rem',
    h7: 'font-weight: 600; font-size: 0.6875rem',
    display_0: 'font-size: 0.625rem',
    display_1: 'font-weight: 600; font-size: 0.625rem',
    display_2: 'font-weight: 400; font-size: 1rem',
    display_3: 'font-size: 0.75rem',
};

const controls = {
    ratioBox: 'position: relative; padding-top: 100%; overflow: hidden;',
    ratioContent: `position: absolute;top: 0;left: 0;right: 0;bottom: 0;max-width: 100%;height: auto;background-color: lightgray;background-position:center`,
};

const theme = {
    fontSizes,
    colors,
    deviceSizes,
    device,
    paddings,
    margins,
    interval,
    verticalInterval,
    fonts,
    controls,
};

export default theme;
