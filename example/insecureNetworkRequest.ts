const apiUrl = 'http://api.example.com/data';
fetch('http://api.example.com/data');
fetch(apiUrl);

import axios from 'axios';
axios.get('http://api.example.com/data');
axios.get(apiUrl);

const xhr = new XMLHttpRequest();
xhr.open('GET', 'http://api.example.com/data');
xhr.send();