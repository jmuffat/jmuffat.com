const optNotPassive = {passive: true}

export class PanZoom {
  constructor(element,opt) {
    this.element = element
    this.opt = opt

    this.mouseDownHandler = e=>this.onMouseDown(e)
    this.mouseMoveHandler = e=>this.onMouseMove(e)
    this.mouseUpHandler   = e=>this.onMouseUp(e)

    this.touchStartHandler = e=>this.onTouch(e)
    this.touchMoveHandler  = e=>this.onTouchMove(e)
    this.touchEndHandler   = e=>this.onTouchEnd(e)
    this.touchInProgress   = false

    this.captureEvents()
  }

  close() {
    this.releaseEvents()
    this.element = null
  }

  captureEvents() {
    this.element.addEventListener('mousedown',  this.mouseDownHandler,  optNotPassive)
    this.element.addEventListener('touchstart', this.touchStartHandler, optNotPassive)
  }

  releaseEvents() {
    this.element.removeEventListener('mousedown',  this.mouseDownHandler,  optNotPassive)
    this.releaseDocumentMouse();

    this.element.removeEventListener('touchstart', this.touchStartHandler, optNotPassive)
    this.releaseTouches();
  }

  captureDocumentMouse() {
    document.addEventListener('mousemove',  this.mouseMoveHandler);
    document.addEventListener('mouseup',    this.mouseUpHandler);
  }

  releaseDocumentMouse() {
    document.removeEventListener('mousemove', this.mouseMoveHandler);
    document.removeEventListener('mouseup',   this.mouseUpHandler);
  }

  captureTouches() {
    if (this.touchInProgress) return;

    this.touchInProgress = true;
    document.addEventListener('touchmove',  this.touchMoveHandler);
    document.addEventListener('touchend',   this.touchEndHandler);
    document.addEventListener('touchcancel',this.touchEndHandler);
  }

  releaseTouches() {
    document.removeEventListener('touchmove',   this.touchMoveHandler);
    document.removeEventListener('touchend',    this.touchEndHandler);
    document.removeEventListener('touchcancel', this.touchEndHandler);
    this.touchInProgress = false;
  }

  getMouseSvgPos(e) {
    const ofs = this.element.getBoundingClientRect()

    var pt = this.element.createSVGPoint();
    pt.x = e.pageX - ofs.left;
    pt.y = e.pageY - ofs.top;

    return pt.matrixTransform( this.element.getScreenCTM().inverse() )
  }

  onMouseDown(e){
    if (this.touchInProgress) {
      // if we're already handling this as touch, ignore mouse events
      e.stopPropagation();
      return false;
    }

    this.captureDocumentMouse()
    this.lastPos = this.getMouseSvgPos(e)
    return false
  }

  onMouseMove(e){
    if (this.touchInProgress) {console.log("shouldn't happen"); return}

    const pos = this.getMouseSvgPos(e)
    this.processPan(pos)
  }

  onMouseUp(e) {
    if (this.touchInProgress) return
    this.releaseDocumentMouse()
  }

  onTouch(e){
    console.log('onTouch')
    e.stopPropagation();
    e.preventDefault();
    this.captureTouches()
    this.lastPos = this.getMouseSvgPos(e)
  }

  onTouchMove(e){
    e.stopPropagation();
    e.preventDefault();

    const pos = this.getMouseSvgPos(e)
    this.processPan(pos)
  }

  onTouchEnd(e) {
    this.releaseTouches()
  }

  processPan(pos) {
    const {x,y} = this.lastPos
    const delta = {x:pos.x-x, y:pos.y-y}
    this.lastPos = pos
    if (this.opt.onPan) this.opt.onPan(delta)
  }
}
