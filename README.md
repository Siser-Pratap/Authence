"# Authence" 



(1) Create sign Up page 

    (1) props to be given
        (a) path of the sign in page? string : default
        (b) forceRedirectUrl? string : null
        (c) signInUrl? string : null
        (d) appearance? black : white : base
        (e) initialvalues if any
        (f) afterSignOutUrl ? string : null

    


    <!-- type RoutingOptions = {
        path: string | undefined;
        routing?: Extract<RoutingStrategy, 'path'>;
    } | {
        path?: never;
        routing?: Extract<RoutingStrategy, 'hash' | 'virtual'>;
    }; -->



    
type SignUpProps = RoutingOptions & {
    <!-- /**
     * Full URL or path to navigate after successful sign up.
     * This value has precedence over other redirect props, environment variables or search params.
     * Use this prop to override the redirect URL when needed.
     * @default undefined
     */
    forceRedirectUrl?: string | null; -->


    <!-- /**
     * Full URL or path to navigate after successful sign up.
     * This value is used when no other redirect props, environment variables or search params are present.
     * @default undefined
     */
    fallbackRedirectUrl?: string | null; -->


    <!-- /**
     * Full URL or path to for the sign in process.
     * Used to fill the "Sign in" link in the SignUp component.
     */
    signInUrl?: string; -->


    <!-- /**
     * Customisation options to fully match the Clerk components to your own brand.
     * These options serve as overrides and will be merged with the global `appearance`
     * prop of ClerkProvided (if one is provided)
     */
    appearance?: SignUpTheme; -->


    <!-- /**
     * Additional arbitrary metadata to be stored alongside the User object
     */
    unsafeMetadata?: SignUpUnsafeMetadata; -->

    <!-- /**
     * Initial values that are used to prefill the sign up form.
     */
    initialValues?: SignUpInitialValues; -->


} & SignInFallbackRedirectUrl & SignInForceRedirectUrl & LegacyRedirectProps & AfterSignOutUrl;


type SignUpInitialValues = {
    emailAddress?: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
};


<!-- type AfterSignOutUrl = {
    /**
     * Full URL or path to navigate after successful sign out.
     */
    afterSignOutUrl?: string | null;
}; -->














    type Theme = {
    /**
     * A theme used as the base theme for the components.
     * For further customisation, you can use the {@link Theme.layout}, {@link Theme.variables} and {@link Theme.elements} props.
     * @example
     * import { dark } from "@clerk/themes";
     * appearance={{ baseTheme: dark }}
     */
    baseTheme?: BaseTheme | BaseTheme[];
    /**
     * Configuration options that affect the layout of the components, allowing
     * customizations that hard to implement with just CSS.
     * Eg: placing the logo outside the card element
     */
    layout?: Layout;
    /**
     * General theme overrides. This styles will be merged with our base theme.
     * Can override global styles like colors, fonts etc.
     * Eg: `colorPrimary: 'blue'`
     */
    variables?: Variables;
    /**
     * Fine-grained theme overrides. Useful when you want to style
     * specific elements or elements that under a specific state.
     * Eg: `formButtonPrimary__loading: { backgroundColor: 'gray' }`
     */
    elements?: Elements;
};
type Layout = {
    /**
     * Controls whether the logo will be rendered inside or outside the component card.
     * To customise the logo further, you can use {@link Appearance.elements}
     * @default inside
     */
    logoPlacement?: 'inside' | 'outside' | 'none';
    /**
     * The URL of your custom logo the components will display.
     * By default, the components will use the logo you've set in the Clerk Dashboard.
     * This option is helpful when you need to display different logos for different themes,
     * eg: white logo on dark themes, black logo on light themes
     * To customise the logo further, you can use {@link Appearance.elements}
     * @default undefined
     */
    logoImageUrl?: string;
    /**
     * Controls where the browser will redirect to after the user clicks the application logo,
     * usually found in the SignIn and SignUp components.
     * If a URL is provided, it will be used as the `href` of the link.
     * If a value is not passed in, the components will use the Home URL as set in the Clerk dashboard
     * @default undefined
     */
    logoLinkUrl?: string;
    /**
     * Controls the variant that will be used for the social buttons.
     * By default, the components will use block buttons if you have less than
     * 3 social providers enabled, otherwise icon buttons will be used.
     * To customise the social buttons further, you can use {@link Appearance.elements}
     * @default auto
     */
    socialButtonsVariant?: 'auto' | 'iconButton' | 'blockButton';
    /**
     * Controls whether the social buttons will be rendered above or below the card form.
     * To customise the social button container further, you can use {@link Appearance.elements}
     * @default 'top'
     */
    socialButtonsPlacement?: 'top' | 'bottom';
    /**
     * Controls whether the SignIn or SignUp forms will include optional fields.
     * You can make a field required or optional through the {@link https://dashboard.clerk.com|Clerk dashboard}.
     * @default true
     */
    showOptionalFields?: boolean;
    /**
     * This options enables the "Terms" link which is, by default, displayed on the bottom-right corner of the
     * prebuilt components. Clicking the link will open the passed URL in a new tab
     */
    termsPageUrl?: string;
    /**
     * This options enables the "Help" link which is, by default, displayed on the bottom-right corner of the
     * prebuilt components. Clicking the link will open the passed URL in a new tab
     */
    helpPageUrl?: string;
    /**
     * This options enables the "Privacy" link which is, by default, displayed on the bottom-right corner of the
     * prebuilt components. Clicking the link will open the passed URL in a new tab
     */
    privacyPageUrl?: string;
    /**
     * This option enables the shimmer animation for the avatars of <UserButton/> and <OrganizationSwitcher/>
     * @default true
     */
    shimmer?: boolean;
    /**
     * This option enables/disables animations for the components. If you want to disable animations, you can set this to false.
     * Also the prefers-reduced-motion media query is respected and animations are disabled if the user has set it to reduce motion regardless of this option.
     * @default true
     */
    animations?: boolean;
    /**
     * This option disables development mode warning.
     * We don't recommend disabling this unless you want to see a preview of how the components will look in production.
     * @default false
     */
    unsafe_disableDevelopmentModeWarnings?: boolean;
};





































(2) Create sign In page



(3) Create logout page 



