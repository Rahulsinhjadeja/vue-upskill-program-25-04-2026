import type { Directive, DirectiveBinding } from 'vue';

const colors: Record<string, string> = {
    Technology: '#6c3ce0',
    Comedy: '#d97706',
    News: '#2563eb',
    Health: '#059669',
    Business: '#db2777',
    Education: '#4338ca'
};

export const vHoverColor: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
        const color = colors[binding.value] || '#6c757d';
        el.style.transition = 'all 0.3s ease';
        el.style.border = '2px solid transparent';

        el.onmouseenter = (): void => {
            el.style.borderColor = color;
            el.style.boxShadow = `0 0 12px 3px ${color}80`;
        };

        el.onmouseleave = (): void => {
            el.style.borderColor = 'transparent';
            el.style.boxShadow = '';
        };
    }
};

