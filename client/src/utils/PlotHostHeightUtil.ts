
const NAV_ID = 'int-main-demo-nav';
const TITLE_ID = 'demotitle';
const TOOLBAR_ID = 'int-toolbar';

// TODO: Make parent component e.g <FullHeightComponent /> responsible for correct size of its children

export default class PlotHostHeightUtil {
    private _appHeaderHeight: number;
    private _demoTitleHeight: number;
    private _toolbarHeight: number;
    calculateHeights () {
        const navigationDiv = document.getElementById(NAV_ID);
        const demoTitleDiv = document.getElementsByClassName(TITLE_ID)[0];
        const toolbarDiv = document.getElementById(TOOLBAR_ID);
        this._appHeaderHeight = navigationDiv != null ? navigationDiv.offsetHeight : 0;
        this._demoTitleHeight = demoTitleDiv != null ? demoTitleDiv.scrollHeight : 0;
        this._toolbarHeight = toolbarDiv != null ? toolbarDiv.offsetHeight : 0;
    }

    get demoHeight () {
        this.calculateHeights();
        return (document.documentElement.clientHeight - this._appHeaderHeight) + 'px';
    }

    get plotHostHeight () {
        this.calculateHeights();
        return (document.documentElement.clientHeight - this._appHeaderHeight - this._demoTitleHeight - this._toolbarHeight) + 'px';
    }
}

