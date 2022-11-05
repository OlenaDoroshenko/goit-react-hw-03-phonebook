import React, { Component } from 'react';
import GlobalStyle from './GlobalStyle';
import { nanoid } from 'nanoid';

import Form from './Form/Form';
import Filter from './Filter/Filter';
import ContactList from './ContactList/ContactList';

export default class Phonebook extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
      this.setState({ contacts: JSON.parse(savedContacts) });
    }
  }

  componentDidUpdate(_, prevState) {
    const contactsToSave = this.state.contacts;
    if (prevState.contacts !== contactsToSave) {
      localStorage.setItem('contacts', JSON.stringify(contactsToSave));
    }
  }

  addContact = contactInfo => {
    const { name, number } = contactInfo;

    if (this.state.contacts.find(contact => contact.name === name)) {
      alert(`${name} is already in contacts`);
      return;
    }

    const contact = {
      id: nanoid(),
      name,
      number,
    };

    this.setState(prevState => ({
      contacts: [contact, ...prevState.contacts],
    }));
  };

  deleteContact = id => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== id),
    }));
  };

  updateFilter = e => {
    this.setState({
      filter: e.currentTarget.value,
    });
  };

  filterContacts = () => {
    const { filter, contacts } = this.state;
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  render() {
    const filteredContacts = this.filterContacts();

    return (
      <>
        <GlobalStyle />
        <h1>Phonebook</h1>
        <Form onSubmit={this.addContact} />
        <h2>Contacts</h2>
        <Filter value={this.state.filter} onChange={this.updateFilter} />
        <ContactList
          contacts={filteredContacts}
          onDelete={this.deleteContact}
        />
      </>
    );
  }
}
