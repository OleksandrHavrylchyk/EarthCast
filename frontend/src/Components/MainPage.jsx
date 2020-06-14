import React from 'react';
import update from 'immutability-helper';
import _ from 'lodash';

import Map from 'pigeon-maps';
import CustomMarker from './CustomMarker';
import { Button, Input, Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Label, Table  } from 'reactstrap';
import { createForecast } from '../Algorithms/forecast.js';
import execute from "../Algorithms/execute";
//import Marker from 'pigeon-marker';

import pigeonSvg from './incubator/pigeon.svg';
import DraggableOverlay from './incubator/draggable-overlay';

const providers = {
  osm: (x, y, z) => {
    const s = String.fromCharCode(97 + (x + y + z) % 3)
    return `https://${s}.tile.openstreetmap.org/${z}/${x}/${y}.png`
  },
  stamenTerrain: (x, y, z, dpr) => {
    return `https://stamen-tiles.a.ssl.fastly.net/terrain/${z}/${x}/${y}${dpr >= 2 ? '@2x' : ''}.jpg`
  },
  stamenToner: (x, y, z, dpr) => {
    return `https://stamen-tiles.a.ssl.fastly.net/toner/${z}/${x}/${y}${dpr >= 2 ? '@2x' : ''}.png`
  }
}

const markers = {
  leuven1: [[50.879, 4.6997], 13],
  leuven2: [[50.874, 4.6947], 13],
  brussels: [[50.85050, 4.35149], 11],
  ghent: [[51.0514, 3.7103], 12],
  coast: [[51.2214, 2.9541], 10]
}

const lng2tile = (lon, zoom) => (lon + 180) / 360 * Math.pow(2, zoom)
const lat2tile = (lat, zoom) => (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)

const Banner = () => (
  <a href="https://github.com/mariusandra/pigeon-maps">
    <img style={{ position: 'absolute', top: 0, right: 0, border: 0 }} src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" alt="Fork me on GitHub" />
  </a>
)

const StamenAttribution = () => (
  <span className='map-attribution'>
    Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.
  </span>
)

const WikimediaAttribution = () => (
    <span className='map-attribution'>
      Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.
    </span>
  )

export default class MainPage extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isModalOpened: false,
      isSibeBarSettingOpen: true,
      isSidebarOpen: false,
      isOpenCreateForecastWindow: false,
      isOpen: false,
      isModalEdit: false,
      maxMagnitude: 9,
      minMagnitude: 2.5,
      numberOfEarthquakes: 200,
      minDepth: "",
      maxDepth: "",
      dataFromFile: [],
      selectedPoints: {},
      pointsData: [],
      center: [50.1102, 3.1506],
      zoom: 6,
      provider: 'osm',
      metaWheelZoom: false,
      twoFingerDrag: false,
      animate: true,
      animating: false,
      zoomSnap: true,
      mouseEvents: true,
      touchEvents: true,
      minZoom: 1,
      maxZoom: 18,
      dragAnchor: [48.8565, 2.3475],
      modalData: {
        lat: 52,
        lon: 25,
        mag: 5,
        depth: 10
      }
    }
  }

  zoomIn = () => {
    this.setState({
      zoom: Math.min(this.state.zoom + 1, 18)
    })
  }

  zoomOut = () => {
    this.setState({
      zoom: Math.max(this.state.zoom - 1, 1)
    })
  }

  fetchEarthquakesData = () => {
    let curretComponent = this;

    const dt = new Date();
    let lastYear = new Date();
    lastYear.setDate(lastYear.getDate() - 365*100);

    const fetchUrl = `http://www.seismicportal.eu/fdsnws/event/1/query?limit=${this.state.numberOfEarthquakes}
                                                                      &minmag=${parseInt(this.state.minMagnitude)}
                                                                      &maxmag=${parseInt(this.state.maxMagnitude)}
                                                                      ${this.state.minDepth ? `&mindepth=${this.state.minDepth}` : ""}
                                                                      ${this.state.maxDepth ? `&maxdepth=${this.state.maxDepth}` : ""}
                                                                      &start=${lastYear.toISOString()}
                                                                      &end=${dt.toISOString()}
                                                                      &format=json`;

    fetch(fetchUrl)
      .then((response) => response.json())
      .then(function(data) {
        console.log(data);
        curretComponent.setState({
          pointsData: data.features
        })
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  componentDidMount = () => {
    //this.fetchEarthquakesData();
    //console.log(this.state.isSibeBarSettingOpen);
    //execute();
    //createForecast();
  }

  handleBoundsChange = ({ center, zoom, bounds, initial }) => {
    if (initial) {
      console.log('Got initial bounds: ', bounds)
    }
    this.setState({ center, zoom })
  }

  handleClick = ({ event, latLng, pixel }) => {
    if (this.state.isSibeBarSettingOpen) {
      let newState = {
        modalData: {
          lat: latLng[0],
          lon: latLng[1],
          mag: this.state.modalData.mag,
          depth: this.state.modalData.depth
        },
      };
      this.setState(newState);

      this.openModal();
    }
  }

  handleMarkerClick = ({ event, payload, latitude, longitude, depth, magnitude }) => {
    const isArrayContainsPoint = Object.keys(this.state.selectedPoints).find(element => element == payload);

    if (isArrayContainsPoint) {
      delete this.state.selectedPoints[payload];
    } else {
      this.setState({
        selectedPoints: Object.assign(this.state.selectedPoints, { [payload]: {
          latitude: latitude,
          longitude: longitude,
          depth: depth,
          magnitude: magnitude
        }}),
      })
    }

    if (_.isEmpty(this.state.selectedPoints)) {
      this.setState({
        isOpenCreateForecastWindow: false
      })
    } else {
      this.setState({
        isOpenCreateForecastWindow: true,
        isSibeBarSettingOpen: false,
        isSidebarOpen: false,
      })
    }
  }

  removePoint = (key) => {
    this.setState({
      selectedPoints: _.omit(this.state.selectedPoints, key)
    });
    this.updatePointStatus(key);
  }

  updatePointStatus = (key) => {
    this[key].updateState();
  }

  createForecast = () => {
    console.log(this.state.selectedPoints);
  }

  handleAnimationStart = () => {
    this.setState({ animating: true })
  }

  handleAnimationStop = () => {
    this.setState({ animating: false })
  }

  setNumberOfEarthquakes = (event) => {
    this.setState({
      numberOfEarthquakes: event.target.value
    })
  }

  setMinMagnitude = (event) => {
    this.setState({
      minMagnitude: event.target.value
    })
  }

  setMaxMagnitude = (event) => {
    this.setState({
      maxMagnitude: event.target.value
    })
  }

  setMinDepth = (event) => {
    this.setState({
      minDepth: event.target.value
    })
  }

  setMaxDepth = (event) => {
    this.setState({
      maxDepth: event.target.value
    })
  }

  toggle = () => this.setState({isOpen : !this.state.isOpen});

  openSideBar = () => this.setState({
    isSidebarOpen: true,
    isSibeBarSettingOpen: false
  });

  closeSideBar = () => this.setState({
    isSidebarOpen: false
  });

  closeSideBarSetting = () => this.setState({
    isSibeBarSettingOpen: false
  });

  openSideBarSetting = () => this.setState({
    isSibeBarSettingOpen: true,
    isSidebarOpen: false
  });

  closeCreateForecast = () => this.setState({
    isOpenCreateForecastWindow: false
  });
  
  openModal = (key) => {
    this.setState({
      isModalOpened: true,
    })

    if (key || key === 0) {
      this.setState({
        isModalEdit: true,
        editKey: key,
        modalData: {
          lat: this.state.dataFromFile[key].latitude,
          lon: this.state.dataFromFile[key].longitude,
          mag: this.state.dataFromFile[key].magnitude,
          depth: this.state.dataFromFile[key].depth
        }
      })
    }
  }

  closeModal = () => this.setState({
    isModalOpened: false,
    isModalEdit: false
  })

  changeModalData = (event) => {
    let fieldName = event.target.name;
    let newState = {
      modalData: {
        lat: this.state.modalData.lat,
        lon: this.state.modalData.lon,
        mag: this.state.modalData.mag,
        depth: this.state.modalData.depth
      },
    };
    newState.modalData[fieldName] = event.target.value;
    this.setState(newState);
  }

  addData = () => {
    this.setState({
      dataFromFile: [...this.state.dataFromFile, {
        latitude: parseFloat(this.state.modalData.lat),
        longitude: parseFloat(this.state.modalData.lon),
        depth: parseFloat(this.state.modalData.depth),
        magnitude: parseFloat(this.state.modalData.mag)
      }],
      isModalOpened: false
    });
  }

  updateData = () => {
    let items = [...this.state.dataFromFile];
    let item = {...items[this.state.editKey]};
    item.latitude = parseFloat(this.state.modalData.lat);
    item.longitude = parseFloat(this.state.modalData.lon);
    item.depth = parseFloat(this.state.modalData.depth);
    item.magnitude = parseFloat(this.state.modalData.mag);
    items[this.state.editKey] = item;
    this.setState({
      dataFromFile: items
    });
    this.closeModal();
  }

  deletePoint = () => {
    let deleteKey = this.state.editKey;
    let formattedItems = _.remove([...this.state.dataFromFile], function (n, key) {
      return key !== deleteKey;
    });

    this.setState({
      dataFromFile: formattedItems
    });

    this.closeModal();
  }

  clearData = () => {
    this.setState({
      pointsData: []
    });
  }

  clearModal = () => {
    let newState = {
      modalData: {
        lat: 0,
        lon: 0,
        mag: 0,
        depth: 0
      },
    };
    this.setState(newState);
  }

  setData = () => {
    this.clearData();
    this.setState({
      pointsData: this.state.dataFromFile.map((item) => {
        return {
          properties: {
            lat: item.latitude,
            lon: item.longitude,
            depth: item.depth,
            mag: item.magnitude
          }
        }
      })
    })
  }

  render () {
    const { center, zoom, provider, animate, metaWheelZoom, twoFingerDrag, zoomSnap, mouseEvents, touchEvents, animating, minZoom, maxZoom } = this.state

    return (
      <div style={{textAlign: 'center', marginLeft: "20px", marginRight: "20px"}}>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">EarthCast</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Sourse of data
                </DropdownToggle>
                <DropdownMenu right>
                <DropdownItem>
                  <span onClick={this.openSideBar}>Fetch from seismicportal</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  <span onClick={this.openSideBarSetting}>Set manually</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Options
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  Option 1
                </DropdownItem>
                <DropdownItem>
                  Option 2
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  Reset
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          </Collapse>
        </Navbar>
        {/* <Banner /> */}
        <Row>
          { this.state.isSidebarOpen &&
          <Col md="3">
            <div className="side-bar-window">
              <div className="window-title">
                <span className="fetch-window-title">Fetch set parameters</span>
                <span className="close-x" onClick={this.closeSideBar}>X</span>
              </div>
              <div className="parameters-section">
                <div className="pt-3">
                  <Label for="earthquakesCount">Number of earthquakes</Label>
                  <Input type="number"
                         id="earthquakesCount"
                         name="number"
                         bsSize="sm"
                         placeholder="Number of earthquakes"
                         value={this.state.numberOfEarthquakes}
                         onChange={(event) => {this.setNumberOfEarthquakes(event)}}/>
                </div>
                <div className="pt-3">
                  <Label for="maxMagnitude">Maximum magnitude</Label>
                  <Input type="number"
                         id="maxMagnitude"
                         name="number"
                         bsSize="sm"
                         placeholder="Maximum magnitude"
                         value={this.state.maxMagnitude}
                         onChange={(event) => {this.setMaxMagnitude(event)}}/>
                </div >
                <div className="pt-3">
                  <Label for="minMagnitude">Minimum magnitude</Label>
                  <Input type="number"
                         id="minMagnitude"
                         name="number"
                         bsSize="sm"
                         placeholder="Minimum magnitude"
                         value={this.state.minMagnitude}
                         onChange={(event) => {this.setMinMagnitude(event)}}/>
                </div>
                <div className="pt-3">
                  <Label for="minDepth">Minimum depth</Label>
                  <Input type="number"
                         id="minDepth"
                         name="number"
                         bsSize="sm"
                         placeholder="Minimum depth"
                         value={this.state.minDepth}
                         onChange={(event) => {this.setMinDepth(event)}}/>
                </div>
                <div className="pt-3">
                  <Label for="maxDepth">Maximum depth</Label>
                  <Input type="number"
                         id="maxDepth"
                         name="number"
                         bsSize="sm"
                         placeholder="Maximum depth"
                         value={this.state.maxDepth}
                         onChange={(event) => {this.setMaxDepth(event)}}/>
                </div>
                <div className="pt-3">
                  <Button outline onClick={() => this.fetchEarthquakesData()}>Fetch data</Button>
                </div>
              </div>
            </div>
          </Col>
          }
          { this.state.isSibeBarSettingOpen &&
          <Col md="3">
            <div className="side-bar-window">
              <div className="window-title">
                <span className="fetch-window-title">Input data of earthquakes</span>
                <span className="close-x" onClick={this.closeSideBarSetting}>X</span>
              </div>
              <div className="parameters-section">
                <Table size="sm" borderless responsive hover>
                  <thead>
                    <tr>
                      <th>Latitude</th>
                      <th>Longitude</th>
                      <th>Depth</th>
                      <th>Magnitude</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.dataFromFile.map((item, key) => (
                      <tr className="cursor-pointer" key={`settedPoint${key}`} onClick={() => this.openModal(key)}>
                        <td>{item.latitude}</td>
                        <td>{item.longitude}</td>
                        <td>{item.depth}</td>
                        <td>{item.magnitude}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="pt-3">
                  <Button size="sm" outline onClick={() => this.openModal()}>+</Button>
                </div>
                <div className="pt-3">
                  <Button outline onClick={() => this.setData()}>Set Data</Button>
                </div>
              </div>
            </div>
          </Col>
          }
          { this.state.isOpenCreateForecastWindow &&
          <Col md="3">
            <div className="side-bar-window">
              <div className="window-title">
                <span className="fetch-window-title">Create Forecast</span>
                <span className="close-x" onClick={this.closeCreateForecast}>X</span>
              </div>
              <div className="parameters-section">
              <Table size="sm" borderless responsive hover>
                <thead>
                  <tr>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Depth</th>
                    <th>Magnitude</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(this.state.selectedPoints).map((key) => (
                    <tr className="cursor-pointer" key={`forecastPoint${key}`} onClick={() => this.removePoint(key)}>
                      <td>{this.state.selectedPoints[key].latitude}</td>
                      <td>{this.state.selectedPoints[key].longitude}</td>
                      <td>{this.state.selectedPoints[key].depth}</td>
                      <td>{this.state.selectedPoints[key].magnitude}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="pt-3">
                <Button outline onClick={() => this.createForecast()}>OK</Button>
              </div>
              </div>
            </div>
          </Col>
          }
          <Modal isOpen={this.state.isModalOpened}>
            <ModalHeader>{this.state.isModalEdit ? "Edit" : "Add"}</ModalHeader>
            <ModalBody>
              <Label for="modalLat">Latitude</Label>
              <Input type="number"
                     id="modalLat"
                     name="lat"
                     bsSize="sm"
                     placeholder="Latitude"
                     value={this.state.modalData.lat}
                     onChange={(event) => {this.changeModalData(event)}}/>
              <div className="pt-3">
                <Label for="modalLon">Longitude</Label>
                <Input type="number"
                       id="modalLon"
                       name="lon"
                       bsSize="sm"
                       placeholder="Longitude"
                       value={this.state.modalData.lon}
                       onChange={(event) => {this.changeModalData(event)}}/>
              </div >
              <div className="pt-3">
                <Label for="modalDepth">Depth</Label>
                <Input type="number"
                       id="modalDepth"
                       name="depth"
                       bsSize="sm"
                       placeholder="Depth"
                       value={this.state.modalData.depth}
                       onChange={(event) => {this.changeModalData(event)}}/>
              </div>
              <div className="pt-3">
                <Label for="modalMagnitude">Magnitude</Label>
                <Input type="number"
                         id="modalMagnitude"
                         name="mag"
                         bsSize="sm"
                         placeholder="Magnitude"
                         value={this.state.modalData.mag}
                         onChange={(event) => {this.changeModalData(event)}}/>
              </div>
            </ModalBody>
            <ModalFooter className="justify-between">
                <div>
                  {this.state.isModalEdit ? <Button color="danger" onClick={() => this.deletePoint()}>Delete</Button> : null}
                </div>
                <div>
                  <Button className="mr-2" color="primary" onClick={this.state.isModalEdit ? () => this.updateData() : () => this.addData()} 
                          disabled={!this.state.modalData.lat || 
                                    !this.state.modalData.lon ||
                                    !this.state.modalData.mag || 
                                    !this.state.modalData.depth}>
                    OK
                  </Button>
                  <Button color="secondary" onClick={this.closeModal}>Cancel</Button>
                </div>
            </ModalFooter>
          </Modal>
          <Col md={this.state.isSidebarOpen || this.state.isSibeBarSettingOpen || this.state.isOpenCreateForecastWindow ? "9" : "12"}>
            <div className="map-container">
              <Map
                limitBounds='edge'
                center={center}
                zoom={zoom}
                provider={providers[provider]}
                dprs={[1, 2]}
                onBoundsChanged={this.handleBoundsChange}
                onClick={this.handleClick}
                onAnimationStart={this.handleAnimationStart}
                onAnimationStop={this.handleAnimationStop}
                animate={animate}
                metaWheelZoom={metaWheelZoom}
                twoFingerDrag={twoFingerDrag}
                zoomSnap={zoomSnap}
                mouseEvents={mouseEvents}
                touchEvents={touchEvents}
                minZoom={minZoom}
                maxZoom={maxZoom}
                attribution={
                  provider === 'stamenTerrain' || provider === 'stamenToner'
                    ? <StamenAttribution />
                    : provider === 'wikimedia'
                      ? <WikimediaAttribution />
                      : null}
                defaultWidth={600}
                height={800}
                boxClassname="pigeon-filters">
                {this.state.pointsData.map((item, key) => (
                  <CustomMarker key={key} 
                                pointId={key} 
                                magnitude={item.properties.mag} 
                                anchor={[item.properties.lat, item.properties.lon]}
                                ref={(id) => {this[key] = id}}
                                payload={key}
                                onClick={this.handleMarkerClick}
                                depth={item.properties.depth}
                                time={item.properties.time} 
                                selectedPoints={this.state.selectedPoints}/>
                ))}
                {/* {Object.keys(this.state.pointsData).map(key => (
                  // <Marker key={key} anchor={markers[key][0]} payload={key} onClick={this.handleMarkerClick} />
                ))} */}
                {/* <CustomMarker key="1" magnitude={12} anchor={[50.34, 0]} payload="1" onClick={this.handleMarkerClick} /> */}
                {/* <DraggableOverlay
                  anchor={this.state.dragAnchor}
                  offset={[60, 87]}
                  onDragMove={(anchor) => console.log('moving pigeon', anchor)}
                  onDragEnd={(anchor) => { console.log('moved pigeon', anchor); this.setState({ dragAnchor: anchor }) }}
                  style={{ clipPath: 'polygon(100% 0, 83% 0, 79% 15%, 0 68%, 0 78%, 39% 84%, 43% 96%, 61% 100%, 79% 90%, 69% 84%, 88% 71%, 100% 15%)' }}>
                  <img
                    src={pigeonSvg}
                    width={100}
                    height={95} />
                </DraggableOverlay> */}
              </Map>
            </div>
          </Col>
        </Row>
        {/* <div>
          <button onClick={this.zoomIn}>Zoom In</button>
          <button onClick={this.zoomOut}>Zoom Out</button>
          {' '}
          {Math.round(center[0] * 10000) / 10000} ({lat2tile(center[0], zoom)})
          {' x '}
          {Math.round(center[1] * 10000) / 10000} ({lng2tile(center[1], zoom)})
          {' @ '}
          {Math.round(zoom * 100) / 100}
          {' - '}
          {animating ? 'animating' : 'stopped'}
        </div> */}
        {/* <div style={{marginTop: 20}}>
          {Object.keys(providers).map(key => (
            <button
              key={key}
              onClick={() => this.setState({ provider: key })}
              style={{fontWeight: provider === key ? 'bold' : 'normal'}}>
              {key}
            </button>
          ))}
        </div> */}
        {/* <div style={{marginTop: 20}}>
          <button onClick={() => this.setState({ animate: !animate })}>{animate ? '[X] animation' : '[ ] animation'}</button>
          <button onClick={() => this.setState({ twoFingerDrag: !twoFingerDrag })}>{twoFingerDrag ? '[X] two finger drag' : '[ ] two finger drag'}</button>
          <button onClick={() => this.setState({ metaWheelZoom: !metaWheelZoom })}>{metaWheelZoom ? '[X] meta wheel zoom' : '[ ] meta wheel zoom'}</button>
          <button onClick={() => this.setState({ zoomSnap: !zoomSnap })}>{zoomSnap ? '[X] zoom snap' : '[ ] zoom snap'}</button>
          <button onClick={() => this.setState({ mouseEvents: !mouseEvents })}>{mouseEvents ? '[X] mouse events' : '[ ] mouse events'}</button>
          <button onClick={() => this.setState({ touchEvents: !touchEvents })}>{touchEvents ? '[X] touch events' : '[ ] touch events'}</button>
        </div> */}
        {/* <div style={{marginTop: 20}}>
          minZoom: <input onChange={(e) => this.setState({ minZoom: parseInt(e.target.value) || 1 })} value={minZoom} type='number' style={{ width: 40 }} />
          {' '}
          maxZoom: <input onChange={(e) => this.setState({ maxZoom: parseInt(e.target.value) || 18 })} value={maxZoom} type='number' style={{ width: 40 }} />
        </div>
        <div style={{marginTop: 20}}>
          {Object.keys(markers).map(key => (
            <button key={key} onClick={() => this.setState({ center: markers[key][0], zoom: markers[key][1] })}>{key}</button>
          ))}
        </div> */}
        {/* <div style={{marginTop: 20}}>
          <a href='https://github.com/mariusandra/pigeon-maps'>Documentation and more on GitHub</a>
        </div> */}
      </div>
    )
  }
}