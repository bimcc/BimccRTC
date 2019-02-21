var drawerPlugins = [
// Drawing tools
    'Pencil',
    'Eraser',
    'Text',
    'Line',
    'ArrowOneSide',
    'ArrowTwoSide',
    'Triangle',
    'Rectangle',
    'Circle',
    'Polygon',
    'Image',
    'BackgroundImage',
    'ImageCrop',

// Drawing options
//'ColorHtml5',
    'Color',
    'ShapeBorder',
    'BrushSize',
    'Resize',
    'ShapeContextMenu',
    'MovableFloatingMode',
    'CloseButton',
    'MinimizeButton',
    'FullscreenModeButton',
    'ToggleVisibilityButton',
    'OvercanvasPopup',
    'OpenPopupButton',
    'Zoom',
    'OpacityOption',
    'LineWidth',
    'StrokeWidth',

    'TextLineHeight',
    'TextAlign',
    'TextFontFamily',
    'TextFontSize',
    'TextFontWeight',
    'TextFontStyle',
    'TextDecoration',
    'TextColor',
    'TextBackgroundColor'
];

var drawerPluginConfig = {
    ShapeBorder: {
        color: 'rgba(0, 0, 0, 0)'
    },
    Pencil: {
        cursorUrl: 'pencil',
        brushSize: 3
    },
    Eraser: {
        brushSize: 5
    },
    Circle: {
        centeringMode: 'normal'
    },
    Rectangle: {
        centeringMode: 'normal'
    },
    Triangle: {
        centeringMode: 'normal'
    },
    Text: {
        fonts: {
            'Georgia': 'Georgia, serif',
            'Palatino': "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
            'Times New Roman': "'Times New Roman', Times, serif",

            'Arial': 'Arial, Helvetica, sans-serif',
            'Arial Black': "'Arial Black', Gadget, sans-serif",
            'Comic Sans MS': "'Comic Sans MS', cursive, sans-serif",
            'Impact': 'Impact, Charcoal, sans-serif',
            'Lucida Grande': "'Lucida Sans Unicode', 'Lucida Grande', sans-serif",
            'Tahoma': 'Tahoma, Geneva, sans-serif',
            'Trebuchet MS': "'Trebuchet MS', Helvetica, sans-serif",
            'Verdana': 'Verdana, Geneva, sans-serif',

            'Courier New': "'Courier New', Courier, monospace",
            'Lucida Console': "'Lucida Console', Monaco, monospace"
        },
        defaultFont: 'Palatino',
        editIconMode: false,
        defaultValues: {
            fontSize: 72,
            lineHeight: 2,
            textFontWeight: 'bold'
        },
        predefined: {
            fontSize: [8, 12, 14, 16, 32, 40, 72],
            lineHeight: [1, 2, 3, 4, 6]
        }
    },
    ShapeContextMenu: {
        position: {
            touch: 'cursor',
            mouse: 'cursor'
        }
    },
    Zoom: {
        enabled: true,
        showZoomTooltip: true,
        useWheelEvents: true,
        zoomStep: 1.05,
        defaultZoom: 1,
        maxZoom: 32,
        minZoom: 1,
        smoothnessOfWheel: 0,
        enableMove: true,
        enableWhenNoActiveTool: true,
        enableButton: true
    },
    Image: {
        scaleDownLargeImage: true,
        maxImageSizeKb: 1024,
        cropIsActive: true
    },
    BackgroundImage: {
        scaleDownLargeImage: true,
        maxImageSizeKb: 1024, //1MB
        acceptedMIMETypes: ['image/jpeg', 'image/png', 'image/gif'],
        dynamicRepositionImage: true,
        dynamicRepositionImageThrottle: 100,
        cropIsActive: false
    }
};

var canvas = new DrawerJs.Drawer(null, {
    toolbarSize: 35,
    toolbarSizeTouch: 43,
    tooltipCss: {
        color: 'white',
        background: 'black'
    },
    backgroundCss: 'transparent',
    activeColor: '#19A6FD',
    canvasProperties: {
        selectionColor: 'rgba(255, 255, 255, 0.3)',
        selectionDashArray: [3, 8],
        selectionBorderColor: '#5f5f5f'
    },
    objectControls: {
        borderColor: 'rgba(102,153,255,0.75)',
        borderOpacityWhenMoving: 0.4,
        cornerColor: 'rgba(102,153,255,0.5)',
        cornerSize: 12,
        hasBorders: true
    },
    objectControlsTouch: {
        borderColor: 'rgba(102,153,255,0.75)',
        borderOpacityWhenMoving: 0.4,
        cornerColor: 'rgba(102,153,255,0.5)',
        cornerSize: 20,
        hasBorders: true
    },
    plugins: drawerPlugins,
    pluginsConfig: drawerPluginConfig,
    defaultActivePlugin: { name: 'Pencil', mode: 'onNew' },
//defaultImageUrl: '/Client/vendor/DrawerJs/images/drawer.jpg',
    transparentBackground: false,
    exitOnOutsideClick: false,
    toolbars: {
        drawingTools: {
            position: 'top',
            positionType: 'outside',
            compactType: 'scrollable',
            hidden: false,
            toggleVisibilityButton: false,
            fullscreenMode: {
                position: 'top',
                hidden: false,
                toggleVisibilityButton: false
            }
        },
        toolOptions: {
            position: 'bottom',
            positionType: 'outside',
            compactType: 'scrollable',
            hidden: false,
            toggleVisibilityButton: false,
            fullscreenMode: {
                position: 'bottom',
                compactType: 'popup',
                hidden: false,
                toggleVisibilityButton: false
            }
        },
        settings: {
            position: 'right',
            positionType: 'outside',
            compactType: 'scrollable',
            hidden: false,
            toggleVisibilityButton: false,
            fullscreenMode: {
                position: 'bottom',
                hidden: true,
                toggleVisibilityButton: true
            }
        }
    }
}, getCanvasWidth(), getCanvasHeight());

function getCanvasWidth() {
//var viewportWidth = $(window).width();
    var canvasWidth = $("#canvas-editor").width();
    return canvasWidth;
}

function getCanvasHeight() {
    var viewportHeight = $('#videos').height() - 95;
    var height = viewportHeight;
    return height;
}