/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: '#1e628c'
            },
            screens: {
                'xs': '475px',
                // Default tailwind breakpoints
                'sm': '640px',
                'md': '768px',
                'lg': '1024px',
                'xl': '1280px',
                '2xl': '1536px',
            },
            spacing: {
                'safe-top': 'env(safe-area-inset-top)',
                'safe-bottom': 'env(safe-area-inset-bottom)',
                'safe-left': 'env(safe-area-inset-left)',
                'safe-right': 'env(safe-area-inset-right)',
            },
            fontSize: {
                'xxs': '0.625rem', // 10px
            },
            maxWidth: {
                'screen-xs': '475px',
            },
            minHeight: {
                'touch': '44px',  // Minimum touch target size
            },
            minWidth: {
                'touch': '44px',  // Minimum touch target size
            },
        },
    },
    plugins: [],
};
