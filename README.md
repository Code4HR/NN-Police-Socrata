# NN-Police-Socrata
Gathers Newport News Police Open Data for syndication to Socrata. This is currently a prototype as a potential solution to [NDoCH-207 Issue #5](https://github.com/Code4HR/NDoCH-2017/issues/5) 

>Crime data from Newport News is published online as downloadable CSV. Syndicating into Socrata would make it more accessible.
>
>https://www.nnva.gov/2229/Open-Data

## Current Status 10/1 @ 23:34
- [x] Cron jobs configured
- [x] API routes are guarded by a secret key
- [x] API route starts all cron jobs
- [x] API route stops all cron jobs
- [x] API route stops specific cron jobs
- [x] API route starts specific cron jobs
- [x] Help page available with api root/key

## To-Do
- [ ] Write fetcher for cron jobs to fire off and grab CSV data
- [ ] Parse data for Socrata syndication
- [ ] Hash files to verify new data
- [ ] Clean up API responses with Pug templates
- [ ] Write unit tests
- [ ] Write logging
- [ ] test functionality