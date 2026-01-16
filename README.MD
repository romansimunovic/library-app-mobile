# Library Mobile App

**Mentor:** Asistent Marko Buljan
**Kolegij:** Programiranje 3 – Filozofski fakultet Osijek, 2. godina diplomskog studija

## Opis projekta

Ovo je mobilna aplikacija za upravljanje knjižnicom. Omogućuje korisnicima:

* Pregled liste knjiga s prikazom dostupnosti
* Dodavanje novih knjiga
* Uređivanje postojećih knjiga
* Brisanje knjiga s potvrdom
* Prikaz detalja o knjizi

Aplikacija koristi **React Native** i **Expo Go**, a komunikacija s backendom odvija se preko **REST API-ja** (Spring Boot backend).

---

## Funkcionalnosti

1. **Lista knjiga** – Dohvat knjiga s backend servisa i prikaz u `FlatList`.
2. **Dodavanje / uređivanje knjige** – Koristi iste forme, provjerava obavezna polja (naslov i autor).
3. **Detalji knjige** – Prikaz svih relevantnih podataka iz BookResponse objekta.
4. **Brisanje knjige** – Potvrda prije brisanja.
5. **Prikaz dostupnosti** – `available` atribut.
6. **Navigacija** – React Navigation (Bottom Tabs + Stack za knjige).
7. **React Hookovi** – `useState` i `useEffect` za dohvat i upravljanje podacima.
8. **HTTP zahtjevi** – Axios preko `.env` varijable `API_URL`.
9. **Osnovna validacija** – Naslov i autor knjige ne smiju biti prazni.
10. **Osvježavanje liste** – Nakon dodavanja, uređivanja ili brisanja knjige.

---

## Tehnički detalji

* **React Native + Expo Go**
* **Axios** za REST API pozive
* **.env** varijabla za backend:

```
API_URL=http://<IP_RAČUNALA>:8080/api
```

* Mobitel mora biti **na istoj Wi-Fi mreži** kao backend server.
* Stilizacija je jednostavna, pregledna i modularna (`BookItem`, `BookFormScreen`, `BookListScreen`, `BookDetailScreen`).

---

## Struktura projekta

```
src/
  api/           -> axios pozivi prema backendu (BookRequest/BookResponse)
  components/    -> BookItem komponenta
  screens/       -> BookHomeScreen, BookListScreen, BookFormScreen, BookDetailScreen
  navigation/    -> Stack navigator za knjige
App.js           -> Root NavigationContainer
.env             -> API_URL
```

---

## Pokretanje projekta

1. Klonirati repo.
2. Instalirati dependencyje:

```bash
npm install
```

3. Pokrenuti Expo bundler:

```bash
expo r -c
```

4. Skenirati QR KOD
5. Otvoriti **Expo Go** na mobitelu (mobitel mora biti na istoj Wi-Fi mreži).
6. `.env` mora sadržavati ispravan IP računala gdje backend sluša:

```
API_URL=http://192.168.x.x:8080/api
```

7. Aplikacija sada može dohvatiti, dodavati, uređivati i brisati knjige preko REST API-ja.

---

## Problemi i rješenja tijekom razvoja

* **Navigator error:** `"A navigator can only contain Screen, Group or React.Fragment..."`
  → Rješenje: Svaki ekran mora biti proslijeđen kroz `component` prop u `Stack.Screen`.

* **Axios timeout / network error:**
  → Uzrok: korištenje `localhost` ili pogrešnog IP-a.
  → Rješenje: koristiti IP računala (`192.168.x.x`) u `.env` i provjeriti mobitel na istoj Wi-Fi mreži.

* **.env varijable:**
  → Expo zahtijeva `babel-plugin-dotenv-import` ili `@env`.
  → Sve pozive prema backendu smo preselili u `api.js` preko `API_URL`.

* **Dodavanje / uređivanje knjige:**
  → Prvotno nije radilo zbog nepostojanja `bookId` u requestu.
  → Sada se koristi BookRequest objekt i backend REST API.

* **Stilizacija:**
  → Originalno su elementi bili nagurani. Dodana pregledna i modularna stilizacija.

---

## AI upotreba

* Korišteno je **ChatGPT (GPT-4/5)** za:

  * Refaktoriranje i modulariziranje koda
  * Predlaganje finalnog dizajna i UX-a
  * Pisanje API sloja (`api.js`) i `.env` konfiguracije
* Sve funkcionalnosti i logika su ručno testirane i potvrđene.
* AI korišten kao pomoćno sredstvo, a ne kao generator cijelog rješenja.

---

## Backend repo

* Backend je u **odvojenom repozitoriju**, koristi Spring Boot i PostgreSQL.
* Konfiguracija: `.properties` file sa IP-om, portom 8080 i autentikacijom za bazu.
* REST API podržava:

```
GET /api/books
GET /api/books/{bookId}
POST /api/books
PUT /api/books/{bookId}
DELETE /api/books/{bookId}
```

* BookRequest/BookResponse su definirani prema zadatku (bez BaseEntity polja).

---

## Zaključak

Ova aplikacija zadovoljava **sve zahtjeve profesora**: funkcionalne, tehničke i UX.
Mobilni app i backend su **povezani preko REST API-ja** i testirani s Expo Go i Postmanom.
