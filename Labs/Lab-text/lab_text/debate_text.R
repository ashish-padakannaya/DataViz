library(rvest)

first_debate16 <- read_html("http://www.presidency.ucsb.edu/ws/index.php?pid=118971")


text <- first_debate16 %>% 
  html_nodes("p")  %>% 
  html_text()  %>% as.data.frame()

names(text)[1]<-paste("t")

#select text begin with HOLT: CLINTON: TRUMP: 
holt<-list()
clinton<-list()
trump<-list()
for (i in 1:nrow(text)) {
  if( grepl("HOLT:+", text$t[i], perl=TRUE) ){
     #print(text[i, "t"])  
    holt[i]<- text[i, "t"]
  }
  else if (grepl("CLINTON:+", text$t[i], perl=TRUE))
  {
    clinton[i]<- text[i, "t"]
  }else if(grepl("TRUMP:+", text$t[i], perl=TRUE)){
    trump[i]<- text[i, "t"]
  }else{
    print("no matches!")
  }
  
}

text$t <- as.character(text$t)
holt_df <- rbind(holt)
holt_df1 <- melt(holt_df)


for( i in 1:length(clinton)){
  if(is.null(clinton[i]) || is.na(clinton[i])){
   
  }else{
    print(clinton[i]);  
  }
  
}

clinton[7]

