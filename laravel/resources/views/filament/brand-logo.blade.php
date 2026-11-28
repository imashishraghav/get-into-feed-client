<div
    x-data="{}"
    x-on:click="if (window.Alpine && window.Alpine.store('sidebar') && !window.Alpine.store('sidebar').isOpen) { $event.preventDefault(); window.Alpine.store('sidebar').open(); }"
    style="display: flex; align-items: center; justify-content: center; padding: 2px 0; cursor: pointer;"
    x-bind:title="! $store.sidebar.isOpen ? 'Expand Sidebar' : 'GetIntoFeed CMS'"
>
    <!-- Official GetIntoFeed Tilted 'G' Logo Badge -->
    <span
        style="width: 28px; height: 28px; border-radius: 6px; background-color: #0c101d; color: #cfff04; box-shadow: 2px 2px 0 #cfff04; transform: rotate(-6deg); display: inline-flex; align-items: center; justify-content: center; font-weight: 900; font-size: 15px; line-height: 1; flex-shrink: 0; font-family: 'Plus Jakarta Sans', sans-serif; transition: transform 0.15s ease;"
        onmouseover="this.style.transform='scale(1.1) rotate(-6deg)';"
        onmouseout="this.style.transform='rotate(-6deg)';"
    >
        G
    </span>
</div>
