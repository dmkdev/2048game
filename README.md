Добавил проект для прохождения собеседований. Говорят пет проекты улучшают карму при поиске работы. 

Проект сделан из базового проекта Next.js На главную страничку добавлена игра 2048. Использован canvas с возможностью регулировки fps :)


Плюс немного юмора:
```typescript
// One more pet project )

import companies from './bestcompanies';
import resume from './resume';

interface IOffer {
  companyName: string,
  salary: number
}

type SearchJobStatus = "completed" | "inprogress";

type Company = {
  name: string,
  mailSentCounter: number,
  sendMail: (text: string) => void
}

interface ISearchJob {
  name: string,
  status: SearchJobStatus,
  offers: IOffer[],
  companies: ICompanyList,
  doAttempt: () => void
}

interface ICompanyList {
  getList: () => Company[],
  find: (fn: (c: Company) => boolean) => Company
}

class FavoriteJobSearch implements ISearchJob {
  name = "Frontend developer";
  offers: IOffer[] = [];
  status: SearchJobStatus = "inprogress";
  companies: ICompanyList;

  bestCompany: Company | null = null;

  constructor(companyList: ICompanyList) {
    this.companies = companyList;
  }

  doAttempt() {
    const mailTargets =
      this.companies
        .getList()
        .filter(company => company.mailSentCounter === 0);

    for (let company of mailTargets) {
      company.sendMail(resume.applyTemplate(company));
      company.mailSentCounter++;
    }

    this.checkReceivedOffers();
  }

  offerReceived(offer: IOffer) {
    this.offers.push(offer);
  }

  checkReceivedOffers() {
    for (let offer of this.offers) {
      if (offer.salary >= Number(process.env.SALARY)) {
        this.status = "completed";
        this.bestCompany = this.companies.find(company => company.name === offer.companyName)
      }
    }
    
  }
}

const myJobSearch = new FavoriteJobSearch(companies);

while (myJobSearch.status !== "completed") {
  myJobSearch.doAttempt();
}

console.log(`Best company: ${myJobSearch.bestCompany}`)

```

