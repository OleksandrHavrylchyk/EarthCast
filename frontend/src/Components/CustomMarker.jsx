import React from 'react'
import PropTypes from 'prop-types'
import { UncontrolledTooltip  } from 'reactstrap';
import moment from "moment";

const imageOffset = {
  left: 15,
  top: 31
}

export default class CustomMarker extends React.Component {
  static propTypes = process.env.BABEL_ENV === 'inferno' ? {} : {
    // input, passed to events
    anchor: PropTypes.array.isRequired,
    payload: PropTypes.any,
    magnitude: PropTypes.number,

    // optional modifiers
    hover: PropTypes.bool,

    // callbacks
    onClick: PropTypes.func,
    onContextMenu: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,

    // pigeon variables
    left: PropTypes.number,
    top: PropTypes.number,

    // pigeon functions
    latLngToPixel: PropTypes.func,
    pixelToLatLng: PropTypes.func
  }

    constructor (props) {
        super(props)

        this.state = {
          hover: false,
          isPointSelected: false
        }
    }

    // what do you expect to get back with the event
    eventParameters = (event) => ({
        event,
        anchor: this.props.anchor,
        payload: this.props.payload
    })

    // delegators

    handleClick = (event) => {
        this.setState({
          isPointSelected: !this.state.isPointSelected
        })
        this.props.onClick && this.props.onClick(this.eventParameters(event))
    }

    handleContextMenu = (event) => {
        this.props.onContextMenu && this.props.onContextMenu(this.eventParameters(event))
    }

    handleMouseOver = (event) => {
        this.props.onMouseOver && this.props.onMouseOver(this.eventParameters(event))
        this.setState({ hover: true })
    }

    handleMouseOut = (event) => {
        this.props.onMouseOut && this.props.onMouseOut(this.eventParameters(event))
        this.setState({ hover: false })
    }
  
    hslToRgb = (h, s, l) => {
        var r, g, b;

        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            var hue2rgb = function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    numberToColorHsl = (magnitude) => {
        const pertangle = ((magnitude - 2.5) * 100) / (9 - 1)
        // as the function expects a value between 0 and 1, and red = 0° and green = 120°
        // we convert the input to the appropriate hue value
        var hue = pertangle * 1.2 / 360;
        // we convert hsl to rgb (saturation 100%, lightness 50%)
        var rgb = this.hslToRgb(hue, 1, .5);
        // we format to css value and return
        return 'rgb(' + rgb[1] + ',' + rgb[0] + ',' + rgb[2] + ')'; 
    }

    pointSize = (magnitude) => {
        const pertangle = ((magnitude - 2.5) * 100) / (9 - 1);
        return pertangle * (30 - 15) / 100 + 15;
    }

    // isPointSelected = (pointId) => {    
    //     return Object.keys(this.props.selectedPoints).find(element => element === pointId);
    // }

  // render

    render () {
    const { left, top, onClick } = this.props

    const style = {
      position: 'absolute',
      transform: `translate(${left - imageOffset.left}px, ${top - imageOffset.top}px)`,
      cursor: onClick ? 'pointer' : 'default'
    }

    const notSelectedPoint = 'none';
    const selectedPoint = '0 0 5px 5px red';

    return (
      <div style={style}
           onClick={this.handleClick}
           onContextMenu={this.handleContextMenu}
           onMouseOver={this.handleMouseOver}
           onMouseOut={this.handleMouseOut}>
        <div id={`Tooltip${this.props.pointId}`} 
             className="custom-marker"
             style={{backgroundColor: this.numberToColorHsl(this.props.magnitude),
                     width: this.pointSize(this.props.magnitude),
                     height: this.pointSize(this.props.magnitude),
                     boxShadow: this.state.isPointSelected ? selectedPoint : notSelectedPoint}}>
          &nbsp;
        </div>
        <UncontrolledTooltip placement="right" target={`Tooltip${this.props.pointId}`}>
              {`Magnitude: ${this.props.magnitude}`}
              <br/>
              {`Depth: ${this.props.depth}`}
              <br/>
              {`Date: ${moment(this.props.time).format("YYYY/MM/DD")}`} 
        </UncontrolledTooltip>
      </div>
    )
  }
}