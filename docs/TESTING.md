End-to-end results
#	Area	        Test                                    Expected	                                Result
1	Dashboard	    Load with seeded data	                6 tickets newest-first, stats 6/2/2/2	    |pass|
2	Search	        Search password	                        Only TKT-001; stats stay global	            |pass|
3	Filter	        Status = In Progress	                Exactly TKT-002, TKT-005	                |pass|  
4	Search+filter	Open + safari	                        Exactly TKT-004	                            |pass|
5	Validation	    Submit empty create form	            4 inline errors, no request	                |pass|
6	Validation	    Invalid email	                        Email-only error	                        |pass|      
7	Create	        Valid form	                            Success screen with TKT-007	                |pass|
8	Dashboard	    After create	                        TKT-007 top, stats 7/3/2/2	                |pass|
9	Detail	        Status change	                        Badge updates, persists on refresh	        |pass|
10	Detail	        Add note	                            Appears with timestamp, persists	        |pass|
11	Search	        Search UI-created ticket by subject	    Found	                                    |pass|
12	Detail	        Status → Closed	                        Dashboard stats 7/2/2/3	                    |pass|
13	Consistency	    API GET of UI-updated ticket	        API data matches UI	                        |pass|
14	404 (data)	    /tickets/TKT-999	                    Not-found card, back button works	        |pass|
15	404 (route)	    /hello	                                Themed 404 page with navbar/footer	        |pass|
16	Guards	        Re-pick same status / empty note	    No network request	                        |pass|
17	Debounce	    Fast typing in search	                One request per pause, no stale overwrite	|pass|
18	API	            GET /api/tickets count	                7 tickets newest-first	                    |pass|
19	API	            ?status=Banana	                        400 invalid status	                        |pass|
20	API	            Case-insensitive search	                Matches	                                    |pass|    
21	API         	GET missing ticket	                    404 not found	                            |pass|    
22	API	            PUT empty body / bad status	            400 both	                                |pass|
23	API	            POST missing field / bad email	        400 both                                    |pass|        
24	Failure	        Server off: dashboard	                Friendly error card, stats hidden quietly	|pass|
25	Failure	        Server off: form submit	                Friendly banner, page intact	            |pass|
26	Recovery	    Server restarted	                    List/actions recover without full reload	|pass|
27	Responsive	    Phone-width spot check	                Tables/forms/filters stack correctly	    |pass|