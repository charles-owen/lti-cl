<template>
  <div class="content cl-lti-console">
    <div class="full">
      <p><label><span>Assignment: </span><select v-model="selectedAssignment">
        <option>any</option>
        <option v-for="app in assignTags">{{app}}</option>
      </select></label></p>
      <p><label><span>Grade item: </span><select v-model="selectedGrade">
        <option>any</option>
        <option>none</option>
        <option v-for="app in gradeTags">{{app}}</option>
      </select></label></p>
      <p><label><span>Member: </span><user-selector :selected="selected"></user-selector></label></p>
      <p class="center"><button :disabled="user === null" @click.prevent="query()">Query</button></p>

      <div v-if="fetched">
        <table class="small" v-if="results.length > 0">
          <tr>
            <th>User</th>
            <th>Name</th>
            <th>Assign</th>
            <th>Item</th>
            <th>File</th>
            <th>Created</th>
            <th>Modified</th>
          </tr>
          <tr v-for="result in results">
            <td :class="result.user.user.length > 10 ? 'small' : ''">{{result.user.user}}</td>
            <td>{{result.user.name}}</td>
            <td>{{result.assignTag}}</td>
            <td>{{result.gradeTag}}</td>
            <td><a :href="toView + path(result)" target="_file"><img :src="toViewImg"></a>
              <a :href="toDownload + path(result)"><img :src="toDownloadImg"></a></td>
            <td class="small">{{result.createdStr}}</td>
            <td class="small">{{result.modifiedStr}}</td>
          </tr>
        </table>
        <p v-if="results.length === 0" class="centerbox secondb center">No files...</p>
      </div>

    </div>

  </div>
</template>

<script>
    import {MemberSelectorVue} from 'course-cl';

    export default {
        data: function() {
            return {
                selectedAssignment: 'any',
                selectedGrade: 'any',
                user: null,

                assignTags: [],
                gradeTags: [],

                toView: Site.root + 'cl/lti/view',
                toDownload: Site.root + 'cl/lti/download',
                toDownloadImg: Site.root + 'vendor/cl/site/img/download.png',
                toViewImg: Site.root + 'vendor/cl/site/img/eye16.png',

                fetched: false,
                results: []
            }
        },

        mounted() {
            this.$parent.setTitle(Console.title + ': LTI Auditing');

            Site.api.get('/api/lti/items', {})
                .then((response) => {
                    if(!response.hasError()) {
                        let data = response.getData('assigntags');
                        if(data !== null) {
                            this.assignTags = data.attributes;
                        }

                        data = response.getData('gradeTags');
                        if(data !== null) {
                            this.gradeTags = data.attributes;
                        }
                    } else {
                        Site.toast(this, response);
                    }

                })
                .catch((error) => {
                    console.log(error);
                    Site.toast(this, error);
                });



        },
        components: {
            'user-selector': MemberSelectorVue
        },
        methods: {
            selected(user) {
                this.user = user;
            },
            query() {
                if(this.user === null) {
                    return;
                }

                this.fetched = false;

                let params = {
                    'memberId': this.user.member.id
                };

                if(this.selectedAssignment !== 'any') {
                    params.assignTag = this.selectedAssignment;
                }


                if(this.selectedGrade !== 'any') {
                    if(this.selectedGrade === 'none') {
                        params.gradeTag = '';
                    } else {
                        params.gradeTag = this.selectedGrade;
                    }
                }

                Site.api.get('/api/lti', params)
                    .then((response) => {
                        if(!response.hasError()) {
                            this.fetched = true;
                            let data = response.getData('outcomes');
                            if(data !== null) {

                                console.log(data.attributes);
                                this.results = data.attributes;
                            }
                        } else {
                            Site.toast(this, response);
                        }

                    })
                    .catch((error) => {
                        console.log(error);
                        Site.toast(this, error);
                    });
            },
            path(result) {
                let assignTag = result.assignTag !== '' ? result.assignTag : '-';
                let gradeTag = result.gradeTag !== '' ? result.gradeTag : '-';
                return '/' + result.user.member.id + '/' + assignTag + '/' + gradeTag;
            }
        }
    }
</script>

// Notice: Not scoped!
<style lang="scss">
div.cl-lti-console {

  label span:first-child {
    display: inline-block;
    width: 10em;
    text-align: right;
    padding: 0 0.25em 0 0;
  }

  input[type=text], option {
    padding: 1px 0.25em;
  }

  select {
    min-width: 15em;
  }

  button:disabled {
    color: gray;
  }

}

</style>