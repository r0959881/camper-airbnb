<template>
    <GMapMap
      :center="center"
      :zoom="6"
      map-type-id="roadmap"
      style="width: 100%; height: 500px"
    >
    <GMapMarker
  v-for="camper in campers"
  :key="camper && camper.id"
  v-if="camper && isValidCoordinate(camper.latitude, camper.longitude)"
  :position="{ lat: camper.latitude, lng: camper.longitude }"
>
  <GMapInfoWindow>
    <div>
      <strong>{{ camper.title }}</strong><br />
      {{ camper.location }}<br />
      Lat: {{ camper.latitude }}, Lng: {{ camper.longitude }}
    </div>
  </GMapInfoWindow>
</GMapMarker>
    </GMapMap>
  </template>
  
  <script>
  export default {
    name: 'MapComponent',
    props: {
      campers: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        center: { lat: 50.8503, lng: 4.3517 }, // Brussels center
      };
    },
    methods: {
      isValidCoordinate(lat, lng) {
        return (
          typeof lat === 'number' &&
          typeof lng === 'number' &&
          !isNaN(lat) &&
          !isNaN(lng)
        );
      },
    },
  };
  </script> 