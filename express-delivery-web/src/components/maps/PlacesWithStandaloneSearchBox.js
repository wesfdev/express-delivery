import React from "react";
import { GoogleMap, withGoogleMap, Marker } from "react-google-maps";

const { compose, withProps, lifecycle } = require("recompose");
const { withScriptjs } = require("react-google-maps");
const { StandaloneSearchBox } = require("react-google-maps/lib/components/places/StandaloneSearchBox");

    const PlacesWithStandaloneSearchBox = compose(
      withProps({
        googleMapURL:
          "https://maps.googleapis.com/maps/api/js?key=AIzaSyAcARHUk4o65m_Oy_2_5yiUksDSQ2mtqmc&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `400px` }} />,
        mapElement: <div style={{ height: `70%` }} />
      }),
      lifecycle({
        componentWillMount() {
          const refs = {};

          this.setState({
            places: [],
            location:{
              lat:15.5000000,
              lng:-90.2500000,              
            },
            onSearchBoxMounted: ref => {
              refs.searchBox = ref;
            },

            getPlace: obj =>{
              let place = { 
                  id: obj.place_id, 
                  addres: obj.formatted_address, 
                  geometry: { 
                    lng: obj.geometry.location.lng(), 
                    lat: obj.geometry.location.lat() 
                  } 
              }

              return place;
            },

            onPlacesChanged: () => {
              const places = refs.searchBox.getPlaces();
              //console.log(this.props)
              if(places.length > 0){
                this.props.formValues.location = this.state.getPlace(places[0]);
              }

              this.setState({
                places
              });
            },

            handleMarkerClick: (e) => {
              console.log('handleMarkerClick', e)
              //console.log(e.latLng.lat(), e.latLng.lng())

              let place = {
                place_id: 1,
                formatted_address:"",
                geometry:{
                  location:{
                    ...e.latLng
                  }
                }
              };

              this.props.formValues.location = this.state.getPlace(place);
              const places = [place];

              this.setState({
                places
              });

            }
          });
    
        }
      }),
      withScriptjs,
      withGoogleMap
    )(props => (
      <div data-standalone-searchbox="">
        <div className='row container-fluid'>
 
          <StandaloneSearchBox
            ref={props.onSearchBoxMounted}
            bounds={props.bounds}
            onPlacesChanged={props.onPlacesChanged}
            >                     
            <input
              className='form-control'
              type="text"
              placeholder="Busque su ubicación o comercio"
              style={{
                boxSizing: `border-box`,
                border: `1px solid transparent`,
                width: `340px`,
                height: `32px`,
                padding: `0 12px`,
                borderRadius: `3px`,
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                fontSize: `14px`,
                outline: `none`,
                textOverflow: `ellipses`
              }}
            />
          </StandaloneSearchBox>      
        </div>
        <div>
          {props.places.map(
            ({ place_id, geometry: { location } }) => (
              <span key={place_id}>
                 {" * También puede seleccionar su ubicación desde el mapa.  "} 
                 <br/>
                 {"Ubicación: "} ({location.lat()}, {location.lng()})
                <GoogleMap defaultZoom={15} defaultCenter={{ lat: location.lat(), lng: location.lng() }} onClick={props.handleMarkerClick}>
                  <Marker position={{ lat: location.lat(), lng: location.lng() }} />
                </GoogleMap>
              </span>
            )
          )}
          
        </div>
    
      </div>
    ));

export default PlacesWithStandaloneSearchBox;



