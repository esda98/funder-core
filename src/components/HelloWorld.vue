<template>
  <div class="hello">
    <p>Server's Test Strings: {{testStrings}}</p>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios';

@Component
export default class HelloWorld extends Vue {
  private testStrings: string = "";
   mounted() {
     let key: string = "?code=EDymyaVLO2m8lDFl3CGlfdGb933rq5Z6jpvawd7VsT05oLK1LImEbA==";
     let testPGRetrieveURL = "https://funder-core-functions.azurewebsites.net/api/testPGRetrieve";
     axios.post(testPGRetrieveURL + key ).then(result=>{
       console.log('success!');
       console.log('result: ' + JSON.stringify(result.data,null,2));
       for (let r in result.data) {
         this.testStrings += result.data[r].value + ";";
       }
     }, reason =>{
       console.log('Add failure: ' + reason);
     })
   }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
