import React from 'react'
import Manager from '../manager'

class Settings extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      cols: 1,
      rows: 1,
      sampleImg: '',
      anchorX: 0.5,
      anchorY: 1
    }
    this.updateConfig = ::this.updateConfig;
  }
  componentWillMount() {
    Manager.on('UPDATE_CONFIG', this.updateConfig);
    Manager.emit('UPDATE_CONFIG', Manager.getCurrentConfig());
  }
  componentWillUnmount() {
    Manager.remove('UPDATE_CONFIG', this.updateConfig);
  }
  updateConfig(config) {
    this.setState(config)
  }
  onNameChange(e) {
    let name = e.target.value;
    this.setState({ name });
    e.target.classList.remove('error');
  }
  submitName(e) {
    let name = e.target.value;
    e.target.classList.remove('error');
    if (!Manager.changeConfigName(name)) {
      e.target.classList.add('error');
    }
  }
  onImgChange(e) {
    let path = e.target.files[0].path;
    Manager.changeConfigSampleImg(path);
  }
  onColChange(e) {
    let cols = e.target.value;
    if (/^[0-9]*$/.test(cols)) {
      this.setState({ cols });
      Manager.changeConfigCol(cols);
    }
    e.target.classList.remove('error');
  }
  submitCols(e) {
    let cols = e.target.value;
    e.target.classList.remove('error');
    if (!Manager.changeConfigCol(cols, true)) {
      e.target.classList.add('error');
    }
  }
  onRowChange(e) {
    let rows = e.target.value;
    if (/^[0-9]*$/.test(rows)) {
      this.setState({ rows });
      Manager.changeConfigRow(rows);
    }
    e.target.classList.remove('error');
  }
  submitRows(e) {
    let rows = e.target.value;
    e.target.classList.remove('error');
    if (!Manager.changeConfigRow(rows, true)) {
      e.target.classList.add('error');
    }
  }
  onAnchorXChange(e) {
    let anchorX = e.target.value;
    if (/^[0-9.-]*$/.test(anchorX)) {
      this.setState({ anchorX });
      Manager.changeConfigAnchorX(anchorX);
    }
    e.target.classList.remove('error');
  }
  submitAnchorX(e) {
    let anchorX = e.target.value;
    e.target.classList.remove('error');
    if (!Manager.changeConfigAnchorX(anchorX, true)) {
      e.target.classList.add('error');
    }
  }
  onAnchorYChange(e) {
    let anchorY = e.target.value;
    if (/^[0-9.-]*$/.test(anchorY)) {
      this.setState({ anchorY });
      Manager.changeConfigAnchorY(anchorY);
    }
    e.target.classList.remove('error');
  }
  submitAnchorY(e) {
    let anchorY = e.target.value;
    e.target.classList.remove('error');
    if (!Manager.changeConfigAnchorY(anchorY, true)) {
      e.target.classList.add('error');
    }
  }
  openFile() {
    document.getElementById('sampleImg').click();
  }
  checkEnter(e) {
    if (e.keyCode === 13) {
      e.target.dispatchEvent(new Event('blur', { bubbles: true }));
    }
  }
  render() {
    let { name, cols, rows, anchorX, anchorY} = this.state;
    return (
      <div className='settings'>
        <div className='item'>
          <label>Name</label>
          <input type='text'
            onChange={::this.onNameChange}
            onKeyDown={::this.checkEnter}
            onBlur={::this.submitName}
            value={name} />
        </div>
        <div className='item'>
          Sample Image
        </div>
        <div className='item'>
          <input type="file"
            id="sampleImg"
            accept="image/*"
            onChange={::this.onImgChange} />
          <button className='pointer' onClick={::this.openFile}>
            Select File
          </button>
        </div>
        <div className='item'>
          <label>Columns</label>
          <input type='text'
            onChange={::this.onColChange}
            onKeyDown={::this.checkEnter}
            onBlur={::this.submitCols}
            value={cols} />
        </div>
        <div className='item'>
          <label>Rows</label>
          <input type='text'
            onChange={::this.onRowChange}
            onKeyDown={::this.checkEnter}
            onBlur={::this.submitRows}
            value={rows} />
        </div>
        <div className='item'>
          <label>Anchor X</label>
          <input type='text'
            onChange={::this.onAnchorXChange}
            onKeyDown={::this.checkEnter}
            onBlur={::this.submitAnchorX}
            value={anchorX} />
        </div>
        <div className='item'>
          <label>Anchor Y</label>
          <input type='text'
            onChange={::this.onAnchorYChange}
            onKeyDown={::this.checkEnter}
            onBlur={::this.submitAnchorY}
            value={anchorY} />
        </div>
      </div>
    )
  }
}

class PoseList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      selected: ''
    }
    this.updatePoses = ::this.updatePoses;
    this.onContextVisible = ::this.onContextVisible;
  }
  componentDidMount() {
    Manager.on('UPDATE_POSELIST', this.updatePoses);
    Manager.on('SET_CONTEXT_VISIBLE', this.onContextVisible);
    Manager.emit('UPDATE_POSELIST', Manager.getCurrentConfig().poses);
  }
  componentWillUnmount() {
    Manager.remove('UPDATE_POSELIST', this.updatePoses);
    Manager.remove('SET_CONTEXT_VISIBLE', this.onContextVisible);
    Manager.setPoseScrollTop(this.divList.scrollTop);
  }
  componentDidUpdate() {
    if (this.scrollToBottom) {
      this.divList.scrollTop = this.divList.scrollHeight;
      this.scrollToBottom = false;
    }
    if (!this.scrollSet) {
      this.divList.scrollTop = Manager.getPoseScrollTop();
      this.scrollSet = true;
    }
  }
  updatePoses(poses) {
    let list = Object.keys(poses);
    this.setState({ list })
    if (list.length > this.state.list.length) {
      this.scrollToBottom = true;
    }
  }
  onClick(item) {
    Manager.setPose(item);
    Manager.setToolPath('poseSettings');
  }
  onMouseEnter(item) {
    const pose = Manager.getCurrentConfig().poses[item];
    Manager.emit('SET_ANIMATED', pose.pattern, pose.speed);
    Manager.emit('SET_ANIMATED_ALPHA', 1);
  }
  onMouseLeave() {
    Manager.emit('SET_ANIMATED_ALPHA', 0);
  }
  onContext(item, event) {
    let items = [
      { title: 'Duplicate', handler: this.onDuplicate.bind(this, item) },
      { title: 'Delete', handler: this.onDelete.bind(this, item) }
    ]
    Manager.addContext(items, event.pageX, event.pageY);
    this.setState({ selected: item });
  }
  onContextVisible(visible) {
    if (!visible) {
      this.setState({ selected: '' });
    }
  }
  onDuplicate(item) {
    Manager.duplicatePose(item);
    Manager.emit('SET_CONTEXT_VISIBLE', false);
  }
  onDelete(item) {
    Manager.deletePose(item);
    Manager.emit('SET_CONTEXT_VISIBLE', false);
  }
  render() {
    let listStyle = {
      height: this.props.height - 332,
      maxHeight: this.props.height - 332,
      overflow: 'auto'
    }
    let list = this.state.list.map((item , i)=> {
      let classes = 'configItem pointer';
      if (this.state.selected === item) {
        classes += ' selected';
      }
      return (
      <div
        key={i}
        className={classes}
        onClick={this.onClick.bind(this, item)}
        onMouseEnter={this.onMouseEnter.bind(this, item)}
        onMouseLeave={this.onMouseLeave.bind(this)}
        onContextMenu={this.onContext.bind(this, item)}>
        {item}
      </div>);
    })
    return (
      <div style={listStyle} ref={(div) => { this.divList = div; }} >
        {list}
      </div>
    )
  }
}

export default class extends React.Component {
  render() {
    return (
      <div>
        <Settings />
        <div className='header'>
          Poses
        </div>
        <PoseList height={this.props.height} />
        <div className='footer'>
          <button onClick={Manager::Manager.addNewPose} >Add New</button>
        </div>
      </div>
    )
  }
}
