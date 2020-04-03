// using d3 for convenience
var main = d3.select('main')
var scrolly = main.select('.scrolly');
var figure = scrolly.select('figure');
var setHeight=figure.select('#set-height_video');
var video=setHeight.select('#v0')
var pic=setHeight.select('.pics')
var article = scrolly.select('article');
var step = article.selectAll('.step');
var n_step=article.selectAll('.non-scro-step')

var v_cutoff=0;
var div_ini_Yoffset=0;//TODO:可能完善的地方：获得div的高度，对应frameNumber会不会单适应，避免其它矛盾？

// initialize the scrollama
var scroller = scrollama();

// generic window resize listener event
function handleResize() {
    // 1. update height of step elements
    var stepH = Math.floor(window.innerHeight);
    step.style('height', stepH + 'px');
    n_step.style('height', stepH + 'px');
    //TODO:它俩随视窗大小而变造成了video在其它高度下与scroll不耦合

    var figureHeight = window.innerHeight / 1.2;
    var figureMarginTop = (window.innerHeight - figureHeight) / 2;

    v_cutoff=stepH+window.innerHeight;

    figure
        .style('height', figureHeight + 'px')
        .style('top', figureMarginTop + 'px');
    video
        .style('height',figureHeight+'px');


    // 3. tell scrollama to update new element dimensions
    scroller.resize();
}

// scrollama event handlers
function handleStepEnter(response) {
    console.log(response);
    // response = { element, direction, index }

    // add color to current step only
    step.classed('is-active', function(d, i) {
        return i === response.index;
    });
    response.index===1?video.style('display','block'):video.style('display','none');
    response.index===2?pic.style('display','block'):pic.style('display','none');
    // update graphic based on step
    figure.select('p').text(response.index + 1);
}

function setupStickyfill() {
    d3.selectAll('.sticky').each(function() {
        Stickyfill.add(this);
    });
}

function init() {
    setupStickyfill();

    // 1. force a resize on load to ensure proper dimensions are sent to scrollama
    handleResize();

    // 2. setup the scroller passing options
    // 		this will also initialize trigger observations
    // 3. bind scrollama event handlers (this can be chained like below)
    scroller.setup({
            step: '.scrolly article .step',
            offset: 0.8,
            debug: true,
        })
        .onStepEnter(handleStepEnter)


    // setup resize event
    window.addEventListener('resize', handleResize);
}

// ##video scrolling SCRIPT
var frameNumber = 0, // start video at frame 0
    // lower numbers = faster playback
    playbackConst = 300,
    // 1.get page height from video duration
    setHeight = document.getElementById("set-height_video"),
    // select video element
    vid = document.getElementById('v0');
    // var vid = $('#v0')[0]; // jquery option

// 2.dynamically set the page height according to video length
vid.addEventListener('loadedmetadata', function() {//TODO:固定了video高度，不用监视器了
    setHeight.style.height = Math.floor(vid.duration) * playbackConst + "px";
});

// 3.Use requestAnimationFrame for smooth playback
function scrollPlay(){
    console.log(window.pageYOffset);
    var frameNumber  = (window.pageYOffset-v_cutoff+560)/playbackConst;//TODO:视频开口和与滑块不对应暂时的解决方法：试加减数
    vid.currentTime  = frameNumber;
    window.requestAnimationFrame(scrollPlay);
}
window.requestAnimationFrame(scrollPlay);

// kick things off
init();

