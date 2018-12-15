client_id = '252985146313-5608v97c495lbbd0ldekeonm0kkprfcr.apps.googleusercontent.com'
client_secret = 'XX5URa_7GO0bcWKRMNQ3xiAO'

var currentUser = {
  attendingChurch: "Yes",
  churchTotal: 1
}


var ApiUrl = 'https://dollardollar.io/api/v1/timjean'

var perms = {};
var names = [];

var Submit = {
  oncreate: function(vnode) {
    if (!currentUser.name) {
      return m.route.set("/rsvp")
    };
    m.request({
      method: "POST",
      url: ApiUrl,
      data: currentUser
    }).then(resp => {
      console.log('got resp', resp);
      this.submitComplete = true;
      m.redraw();
    })
  },
  submitComplete: false,
  view: function() {
    return m("div", [
      m("div", {class: !this.submitComplete ? "uk-text-center" : "uk-hidden"}, [
        m('div.uk-padding', {"uk-spinner": 'ratio: 3'}),
        m('p', "Just a moment...")
      ]),
      m('div', {class: this.submitComplete ? "uk-flex.uk-flex-column.uk-child-width-1-1" : 'uk-hidden'}, [
          m('div.uk-text-center', [
            m('h3.t1', "All Done!"),
            m('h3.t1', "Thank you for RSVPing"),
          ])
      ])
    ])
  }
}

//var submit = function () {
//  m.request({
//    method: "POST",
//    url: ApiUrl,
//    data: currentUser
//  })
//}

var RSVP = {
  buttonDisabled: true,
  loaded: false,
  selectedName: "",
  oncreate: function (vnode) {
    m.request({
      method: 'GET',
      url: ApiUrl
    }).then((resp) => {
      names = Object.keys(resp);
      perms = resp;
      this.loaded = true;
      var node = document.getElementById('name-input')
      new Awesomplete(node, {list: names});
      node.addEventListener('awesomplete-selectcomplete', (event) => {
        var name = event.target.value;
        var pos = names.indexOf(name)
        currentUser.name = name;
        currentUser.perms = perms[name];
        this.buttonDisabled = false;
        m.redraw();
      })
    })
  },
  goToChurch: function () {
    m.route.set("/church")
  },
  view: function () {
    //if (!this.loaded) {
    //}
    //return (m('div.uk-card.uk-card-body.uk-card-default', [
    return (m('div', [
      m("div", {class: !this.loaded ? "uk-text-center" : "uk-hidden"}, [
        m('div.uk-padding', {"uk-spinner": 'ratio: 3'}),
        m('p', "Just a moment...")

      ]),
      m('div', {class: this.loaded ? "uk-flex.uk-flex-column.uk-child-width-1-1" : 'uk-hidden'}, [
        m("h3.uk-text-center.uk-margin-large-top", "Hi! What's your name?"),
        m('input#name-input.uk-margin', {
          autofocus: true,
        }),
        m("button.uk-button.uk-button-primary.uk-margin", {
          disabled: this.buttonDisabled,
          onclick: this.goToChurch,
          type: 'button',
        }, "Next"),

      ]),
    ]))
  }
}

var Church = {
  oncreate: function () {
    if (!currentUser.name) {
      m.route.set("/rsvp")
    }
  },
  bringingFamily: [
    ["1 Person", 1],
    ["2 People", 2],
    ["3 People", 3],
    ["4 People", 4],
  ],
  view: function () {
    //return m("div.uk-card.uk-card-body.uk-card-default.uk-animation-fade", [
    return m("div.uk-animation-fade", [
      m("div.uk-flex.uk-flex-column.uk-flex-middle", [
        m('img', {src: 'church.png', style: {width: '200px'}}),
        m('h2.t3', "RSVP - Church Ceremony"),
        m("h3", `Hi ${currentUser.name}!`),
        m("div.uk-flex.uk-margin", [
          m("span", 'Will you be attending the church wedding?'),
          m("div", [
            m('label', {style: {'margin-left': '20px'}}, [
              m('input.uk-radio', {
                type: 'radio', name: 'attending', value: "Yes",
                onclick: m.withAttr('value', val => currentUser.attendingChurch = val),
                checked: currentUser.attendingChurch == "Yes"
              }),
              m('span.uk-margin-small-left', 'Yes')
            ]),
            m('label', {style: {'margin-left': '20px'}}, [
              m('input.uk-radio', {
                type: 'radio', name: 'attending', value: "No",
                onclick: m.withAttr('value', val => currentUser.attendingChurch = val),
                checked: currentUser.attendingChurch == "No"
              }),
              m('span.uk-margin-small-left', 'No')
            ]),
          ]),
        ]),
        m('div.uk-margin.uk-flex.uk-flex-middle', [
          m("label", {style: {'white-space': 'nowrap'}}, "How many people are coming in total?"),
          m('select.uk-select.uk-margin-small-left.uk-width-small', {
            onchange: m.withAttr('value', val => currentUser.churchTotal = val),
          }, this.bringingFamily.map((opt)=> {
            return m('option', {value: opt[1]}, opt[0])
          }))
        ]),
        currentUser.perms && currentUser.perms.invitedToDinner ?
            m('button.uk-button.uk-button-primary.uk-width-1-1.uk-margin-top',
                {
                  onclick: () => {
                    m.route.set('/dinner')
                  }
                },
                "Next: RSVP For Dinner") :
            m('button.uk-button.uk-button-primary.uk-width-1-1.uk-margin-top',
                {onclick: () => {m.route.set('/submit')}},
                "Submit")
      ]),
    ])
  }
}

var Dinner = {
  oncreate: function () {
    if (!currentUser.name) {
      m.route.set("/rsvp")
    } else {
      //currentUser.attendingDinner = "Yes";
      currentUser.attendingDinner = "Yes";
      currentUser.dietaryRestriction = "No";
      m.redraw();
    }

  },
  dietaryRestrictions: [
    ["No", "No"],
    ["Vegan", "Vegan"],
    ["Vegetarian", "Vegetarian"],
    ["Halal", "Halal"]
  ],
  view: function () {
    return m("div.uk-animation-fade", [
      m('div.uk-flex.uk-flex-column.uk-flex-middle', [
        m('img', {src: 'vines.png', style: {width: '200px'}}),
        m('h2.t3', "RSVP - Dinner Celebration"),
        m('div.uk-flex.uk-margin', [
          m("span", "Will you be attending dinner?"),
          m("div.uk-margin-left", [
            m('label.uk-margin-left', [
              m('input.uk-radio', {
                type: 'radio', name: 'attending', value: "Yes",
                onclick: m.withAttr('value', val => currentUser.attendingDinner = val),
                checked: currentUser.attendingDinner == "Yes"
              }),
              m('span.uk-margin-small-left', 'Yes')
            ]),
            m('label.uk-margin-left', [
              m('input.uk-radio', {
                type: 'radio', name: 'attending', value: "No",
                onclick: m.withAttr('value', val => currentUser.attendingDinner = val),
                checked: currentUser.attendingDinner == "No"
              }),
              m('span.uk-margin-small-left', 'No')
            ]),
          ])
        ]),
        m("div.uk-flex.uk-flex-middle.uk-margin", [
          m('span', "Any dietary restrictions?"),
          m("select.uk-select.uk-margin-small-left.uk-width-small", {
            onchange: m.withAttr('value', val => currentUser.dietaryRestriction = val),
          }, this.dietaryRestrictions.map(opt => {
            return m('option', {value: opt[0]}, opt[1])
          }))
        ]),
        currentUser.perms && currentUser.perms.allowedPlus1 > 0 ?
            currentUser.perms.allowedPlus1 == 1 ?
                m('div.uk-flex.uk-margin', [
                  m("span", "Are you bringing a partner?"),
                  m("div.uk-margin-left", [
                    m('label.uk-margin-left', [
                      m('input.uk-radio', {
                        type: 'radio', name: 'totalComing', value: "2",
                        onclick: m.withAttr('value', val => currentUser.dinnerTotalComing = val),
                        checked: currentUser.dinnerTotalComing == "2"
                      }),
                      m('span.uk-margin-small-left', 'Yes')
                    ]),
                    m('label.uk-margin-left', [
                      m('input.uk-radio', {
                        type: 'radio', name: 'totalComing', value: "1",
                        onclick: m.withAttr('value', val => currentUser.dinnerTotalComing = val),
                        checked: currentUser.dinnerTotalComing == "1"
                      }),
                      m('span.uk-margin-small-left', 'No')
                    ]),
                  ])
                ]) :
                m('div.uk-margin', [
                  m('div.uk-flex.uk-flex-middle.uk-margin', [
                    m('span', "How many people are coming in total?"),
                    m("select.uk-select.uk-margin-small-left.uk-width-small", {
                      onchange: m.withAttr('value', val => currentUser.dinnerTotalComing = val),
                    }, [...Array(currentUser.perms.allowedPlus1).keys()].slice(1).map(opt => {
                      return m('option', {value: opt + 1}, `${opt + 1} people`)
                    }))
                  ])
                ])
            : null,
        m("button.uk-button.uk-button-primary.uk-width-1-1.uk-margin-top",
            {onclick: () => {m.route.set('/submit')}},
            "Submit")
      ]),
    ])
  },
}


var container = document.getElementById('mithril')
m.route(container, "/rsvp", {
  "/rsvp": RSVP,
  "/church": Church,
  "/dinner": Dinner,
  "/submit": Submit

})

//m.mount(, RSVP);


