<template>
  <v-app dark>
    <v-navigation-drawer clipped fixed app>
      <v-list dense>
        <v-list-tile>
          <v-list-tile-content>
              <v-list-tile-title>Satellites:</v-list-tile-title>
            </v-list-tile-content>
          <v-list-tile-action>
            <v-btn flat v-on:click="refreshSockets"><v-icon>refresh</v-icon></v-btn>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider></v-divider>
        <v-data-table
          :headers="headers"
          :items="satelliteData"
          hide-actions
          class="elevation-1">
          <template slot="items" slot-scope="props">
            <tr @click="props.expanded = !props.expanded">
              <td>{{props.item.id}}</td>
              <td>{{props.item.location}}</td>
              <td>
                <div v-if="props.item.online === true">
                  <v-progress-circular
                    :size="20"
                    :width="10"
                    :rotate="360"
                    :value="100"
                    class="green--text"
                    style="margin-left: 10px;"
                  >
                  </v-progress-circular>
                </div>
                <div v-else>
                  <v-progress-circular
                    :size="20"
                    :width="10"
                    :rotate="360"
                    :value="100"
                    class="red--text"
                    style="margin-left: 10px;"
                  >
                  </v-progress-circular>
                </div>
              </td>
            </tr>
          </template>
          <template slot="expand" slot-scope="props">
            <v-card flat>
              <v-card-text>URL: {{props.item.url}}</v-card-text>
            </v-card>
          </template>
        </v-data-table>
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
            v-model="targetAddress"
            value=""
            class="pl-5 pr-5 pt-2"
            single-line
            dark>
          </v-text-field>
            <v-btn color="error" dark v-on:click="fire">Fire!</v-btn>
        </v-layout>
        </v-flex>
        </v-layout>
      </v-container>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <google-map ref="googleMap"></google-map>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer app fixed>
      <span>&copy; 2017 Transitbuster</span>
    </v-footer>
  </v-app>
</template>

<script>

import data from './data.json'
import axios from 'axios'

  export default {
    data: function () {
      return {
        drawer: null,
        headers: [
          {text: 'ID', value: 'id', align: 'left'},
          {text: 'Location', value: 'location', align: 'left'},
          {text: 'Online', value: null, align: 'left'}
        ],
        satelliteData: [],
        websocketConnections: [],
        targetAddress: ""
      }
    },
    mounted() {
      var self = this
      self.satelliteData = data.satellites
      this.refreshSockets()

      console.log(self.$refs.googleMap)
    },
    methods: {

      refreshSockets: function() {
        var self = this
        for(let satelliteIndex in self.satelliteData) {
          this.connectSocket(satelliteIndex)
        }
      },
      connectSocket: function(satelliteIndex) {
        var self = this
        let satellite = self.satelliteData[satelliteIndex]
        let WebSocket = window.WebSocket || window.MozWebSocket
        let connection = new WebSocket('ws://' + satellite.url + ':3001')
        connection.onopen = function() {
          self.satelliteData[satelliteIndex].online = true
          console.log('Connected! : ' + self.satelliteData[satelliteIndex].location)
          connection.send('healthcheck')
          self.websocketConnections.push(connection)
        }
        connection.onerror = function (error) {
          self.satelliteData[satelliteIndex].online = false
          console.log(error)
        }

        connection.onclose = function () {
          console.log('connection closed!')
          self.satelliteData[satelliteIndex].online = false
        }

        connection.onmessage = function (message) {
          console.log(message.data)
        }
      },
      traceTarget: function(ipAddress) {
        console.log(ipAddress)
      },

      fire: function() {
        var self = this 
        let target = self.targetAddress
        if(target != "") {
          axios.get('http://freegeoip.net/json/' + target).then(response => {
            self.$refs.googleMap.setTargetMarker(response.data)
            console.log(response.data)
            for(let i in self.websocketConnections) {
              let websocket = self.websocketConnections[i]
              websocket.send("traceroute:" + target)
            }
          })
        }
      }
    }
  }
</script>