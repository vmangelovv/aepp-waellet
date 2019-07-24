import {onBeforeLoad} from '../support/mock_chrome.js';
import {login} from '../login';
import  { PUBLIC_KEY_SEND,account ,getLatestThreeTransactions} from '../utils';


describe("Test cases for Send Page", () => {
    it("open send page", () => {
        login();
        cy
        .visit("popup/popup.html",{onBeforeLoad})
        .get('.sendBtn')
        .click()
        .get('.ae-address-input')
        .should('be.visible')
        .get('.sendAmount')
        .should('be.visible')
        .get('.sendBtn')
        .should('be.visible');
    });

    it("open send page and back to account", () => {
        login();
        cy
        .visit("popup/popup.html",{onBeforeLoad})
        .get('.sendBtn')
        .click()
        .get('.ae-address-input')
        .should('be.visible')
        .get('.sendAmount')
        .should('be.visible')
        .get('.actions .toAccount')
        .should('be.visible')
        .click()
        .get('.ae-card.primary')
        .should('be.visible')
    });

    it("check enter public key",() => {
        login();
        cy
        .visit("popup/popup.html",{onBeforeLoad})
        .get('.sendBtn')
        .click()
        .get('.ae-input.aemount')
        .type('0.001')
        .get('.sendBtn')
        .click()
        .get('.ae-modal-light')
        .should('be.visible')
        .get('.ae-modal-light h1')
        .should('contain','Incorrect address')
        .get('.ae-modal-light button')
        .click()
        .get('.ae-modal-light')
        .should('not.be.visible')
    });

    it("check enter amount",() => {
        login();
        cy
        .visit("popup/popup.html",{onBeforeLoad})
        .get('.sendBtn')
        .click()
        .get('.ae-address-input')
        .type('asdasdsad')
        .get('.ae-input.aemount')
        .type('-1.2')
        .get('.sendBtn')
        .click()
        .get('.ae-modal-light')
        .should('be.visible')
        .get('.ae-modal-light h1')
        .should('contain','Enter amount')
        .get('.ae-modal-light button')
        .click()
        .get('.ae-input.aemount')
        .clear()
        .type('0')
        .get('.sendBtn')
        .click()
        .get('.ae-modal-light')
        .should('be.visible')
        .get('.ae-modal-light button')
        .click()
        .get('.ae-input.aemount')
        .clear()
        .type('0.00000')
        .get('.sendBtn')
        .click()
        .get('.ae-modal-light')
        .should('be.visible')
        .get('.ae-modal-light button')
        .click()
        .get('.ae-modal-light')
        .should('not.be.visible')
    });

    it("validate input before send", () => {
        login();
        cy
        .visit("popup/popup.html",{onBeforeLoad})
        .wait(5000)
        .get('.sendBtn')
        .click()
        .get('.sendBtn')
        .click()
        .get('.ae-modal-light')
        .should('be.visible')
        .get('.ae-modal-light h1')
        .should('contain','Incorrect address')
        .get('.ae-modal-light button')
        .click()
        .get('.ae-address-input')
        .type('asdasdsad')
        .get('.sendBtn')
        .click()
        .get('.ae-modal-light h1')
        .should('contain','Enter amount')
        .get('.ae-modal-light button')
        .click()
        .wait(5000)
        .get('.ae-input.aemount')
        .type('0.00000001')
        .get('.sendBtn')
        .click()
        .get('.ae-modal-light')
        /*  this line will be edited from .primary to .alternative */ .get('.buttons > .primary')
        .click()
        .get('.ae-input.aemount')
        .clear()
        .type('2000')
        .get('.sendBtn')
        .click()
        .get('.ae-modal-light h1')
        .should('contain','Insufficient balance')
    });

    it("can send tokens", () => {
        login();
        cy
        .visit("popup/popup.html",{onBeforeLoad})
        .wait(5000)
        .get('.sendBtn')
        .click()
        .get('.ae-address-input')
        .type(PUBLIC_KEY_SEND)
        .wait(5000)
        .get('.ae-input.aemount')
        .type('0.00000001')
        .get('.sendBtn')
        .click()
        .get('.spendTxDetailsList')
        .should('be.visible')
        .get('.confirm')
        .should('not.have.class','disabled')
        .get('.reject')
        .click()
        .get('.spendTxDetailsList')
        .should('not.be.visible')
        // .get('.ae-modal-light')
        // .should('be.visible')
        // .get('.ae-modal-light h1')
        // .should('contain','Confirm transaction?')
        // /*  this line will be edited from .primary to .alternative */ .get('.buttons > .primary')
        // .click()
        // .get('.ae-modal-light')
        // .should('not.be.visible')
    });

    it("send tokens and check have transaction item after send", () => {
        login();
        let txHash = '';
        cy
        .visit("popup/popup.html",{onBeforeLoad})
        .wait(5000)
        .get('.sendBtn')
        .click()
        .get('.ae-address-input')
        .type(PUBLIC_KEY_SEND)
        .get('.ae-input.aemount')
        .type('0.001')
        .get('.sendBtn')
        .click()
        // .get('.ae-modal-light')
        // .should('be.visible')
        // .get('.ae-modal-light h1')
        // .should('contain','Confirm transaction?')
        // .get('.buttons > .alternative')
        // .click()
        .get('.spendTxDetailsList')
        .should('be.visible')
        .get('.confirm')
        .should('not.have.class','disabled')
        .wait(4000)
        .get('.ae-modal-light')
        .find('.buttons > .primary')
        .click()
        .get('.txHash')
        .then(elem => {
            txHash = elem.val();
            cy
            .get('.toAccount')
            .click()
            .get('.transactionList')
            .should('be.visible')
            .get('.transactionList .list-item-transaction').eq(0)
            .should('have.class',txHash);
        })
       
    });
});