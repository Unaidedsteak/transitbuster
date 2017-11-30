<template>
  <v-app id="inspire" dark>
    <v-navigation-drawer
      clipped
      fixed
      app
    >
      <v-list dense>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Dashboard</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left>
      <v-container grid-list-xl text-xs-center>
        <v-layout row wrap>
        <v-toolbar-title class="pt-2">Transitbuster</v-toolbar-title>
        <v-flex xs4 offset-xs4>
          <v-layout>
          <h1 class="pt-2">Target:</h1>
          <v-text-field
            name="targetInput"
            value=""
            class="pl-5 pr-5 pt-2"
            single-line
            dark></v-text-field>
            <v-btn color="error" dark>Fire!</v-btn>
        </v-layout>
        </v-flex>
        
        </v-layout>
        
      </v-container>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <world-map>
          </world-map>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer app fixed>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>

//const worldMap = require('./Map')

import * as d3 from 'd3-dsv'

  export default {
    // components: {
    //   worldMap: worldMap
    // },
    data: () => ({
      drawer: null
    }),
    props: {
      source: String
    }
  }
</script>