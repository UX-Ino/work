/**
 *  Modal
 */
function Modal() {
  const {
    actions, props, state, setProps, setState, setTarget, addEvent, removeEvent
  } = etUI.hooks.useCore({
    // props
    dimmClick: true,
    esc: true,
  }, {
    // state

  }, render);

  // constant
  const DIMM_OPACITY = 0.6;

  // variable
  const name = 'modal';
  let component = {};

  let focusTrapInstance,
    modalDimmSelector, modalCloseBtnSelector;
  let $target, $html,
    $modalTitle, $modalContainer, $modalDimm;

  {
    /**
     * init
     * @param _$target
     * @param _props
     */
    function init(_$target, _props) {
      if(typeof _$target === 'string'){
        $target = document.querySelector(_$target)
      }else{
        $target = _$target;
      }

      if(!$target){
        throw Error('target이 존재하지 않습니다.');
      }

      setTarget($target)
      setProps({...props, ..._props});

      if ($target.ui) return;
      $target.ui = component;

      setup();
      setEvent();

      $target.setAttribute('data-init', 'true');
    }

    function setup() {
      setupTemplate();
      setupSelector();
      setupElement();
      setupActions();

      // focus trap
      focusTrapInstance = focusTrap.createFocusTrap($target, {
        escapeDeactivates: props.esc,
        onActivate: actions.focusActivate,
        onDeactivate: actions.focusDeactivate
      });

      // state
      // setState({ state: props.state });
    }

    /**
     * update
     * @param _props
     */
    function update(_props) {
      if (_props && etUI.utils.shallowCompare(props, _props) && !$target.getAttribute('data-init')) return;
      destroy();

      setProps({ ...props, ..._props });
      setup();
      setEvent();
    }

    function destroy() {
      removeEvent();
      $target.ui = null;
      $target.removeAttribute('data-init');
    }
  }

  // frequency
  function setupTemplate() {
    // $target.innerHTML = ``;
  }

  function setupSelector(){
    // selector
    modalCloseBtnSelector = '.modal-close'
    modalDimmSelector = '.modal-dimm'

    // element
    $modalTitle = $target.querySelector('.modal-tit')
    $modalDimm = $target.querySelector(modalDimmSelector)
    $modalContainer = $target.querySelector('.modal-container')
    $html = document.documentElement;
  }

  function setupElement() {
    // set id
    const id = etUI.utils.getRandomUIID(name);
    const titleId = etUI.utils.getRandomUIID(name + '-tit')

    // a11y
    etUI.utils.setProperty($target, 'role', 'dialog');
    etUI.utils.setProperty($target, 'aria-modal', 'true');
    etUI.utils.setProperty($target, 'id', id);
    if($modalTitle) etUI.utils.setProperty($modalTitle, 'id', titleId);
    etUI.utils.setProperty($target, 'aria-labelledby', titleId);
    etUI.utils.setProperty($target, 'tabindex', '-1');
  }

  function setupActions(){
    const { getTopDepth, setLayerOpacity } = etUI.hooks.useLayer('modal');

    actions.focusActivate = () => {
    }

    actions.focusDeactivate = () => {
      close();
      // actions.close();
    }

    actions.open = () => {
      const zIndex = getTopDepth();

      $target.style.display = 'block'
      $target.style.zIndex = zIndex

      setLayerOpacity(DIMM_OPACITY);

      gsap.timeline()
        .to($modalDimm, {duration: 0, display: 'block', opacity: 0})
        .to($modalDimm, {duration: 0.15, opacity: 1})

      gsap.timeline()
        .to($modalContainer, {duration: 0, display: 'block', opacity: 0, scale: 0.95, yPercent: 2})
        .to($modalContainer, {duration: 0.15, opacity: 1, scale: 1, yPercent: 0, ease: 'Power2.easeOut'})
    }

    actions.close = () => {
      gsap.timeline()
        .to($modalDimm, {duration: 0.15, opacity: 0, onComplete(){
            $modalDimm.style.display = 'none';
          }})

      gsap.timeline()
        .to($modalContainer, {duration: 0.15, opacity: 0, scale: 0.95, yPercent: 2, ease: 'Power2.easeOut', onComplete(){
            $modalContainer.style.display = 'none';
            $target.style.display = 'none';
            $target.style.zIndex = null

            setLayerOpacity(DIMM_OPACITY);
          }})
    }
  }

  function setEvent() {
    addEvent('click', modalCloseBtnSelector, close);

    if(props.dimmClick){
      addEvent('click', modalDimmSelector, close);
    }
  }

  function render() {
    const isOpened = state.state === 'open';

    if(isOpened){
      actions.open()

      focusTrapInstance.activate();
    }else{
      actions.close()

      focusTrapInstance.deactivate();
    }
  }

  function open(){
    setState({state: 'open'});
  }

  function close(){
    setState({state: 'close'});
  }

  component = {
    core: {
      state,
      props,

      init,
      removeEvent,
      destroy,
    },
    update,
    open,
    close,
  };

  return component;
}
