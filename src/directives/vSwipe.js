export default {
    mounted(el, binding) {
        let startX, startY;
        let isScrolling = false;
        let isDragging = false;

        const touchStart = (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isScrolling = false;
            isDragging = true;
        };

        const touchMove = (e) => {
            if (!startX || isScrolling) return;

            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = currentX - startX;
            const diffY = currentY - startY;

            if (Math.abs(diffX) > Math.abs(diffY)) {
                e.preventDefault();
            } else {
                isScrolling = true;
            }
        };

        const touchEnd = (e) => {
            if (!startX || isScrolling) return;

            const diffX = e.changedTouches[0].clientX - startX;
            if (diffX < -50) binding.value();

            startX = null;
            isDragging = false;
        };

        el.addEventListener('touchstart', touchStart, { passive: false });
        el.addEventListener('touchmove', touchMove, { passive: false });
        el.addEventListener('touchend', touchEnd, { passive: true });

        const mouseDown = (e) => {
            startX = e.clientX;
            startY = e.clientY;
            isScrolling = false;
            isDragging = true;
        };

        const mouseMove = (e) => {
            if (!isDragging || isScrolling) return;

            const diffX = e.clientX - startX;
            const diffY = e.clientY - startY;

            if (Math.abs(diffX) < Math.abs(diffY)) {
                isScrolling = true;
            }
        };

        const mouseUp = (e) => {
            if (!isDragging || isScrolling) return;

            const diffX = e.clientX - startX;
            if (diffX < -50) binding.value();

            startX = null;
            isDragging = false;
        };

        el.addEventListener('mousedown', mouseDown);
        el.addEventListener('mousemove', mouseMove);
        el.addEventListener('mouseup', mouseUp);
    }
};
