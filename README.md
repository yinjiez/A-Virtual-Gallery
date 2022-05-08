#  <img src="https://user-images.githubusercontent.com/71335808/167276461-662eb9f2-1c55-4c07-ac4e-791dc307a8a3.png" width="50" height="50"> Virtual Art Gallery Web App

## Introduction
Our virtual art gallery web-application aims to provide users an enriched browsing experience with 80,000+ 2D-artworks exhibited/hosted by National Gallery of Art (NGA), meanwhile, opens a new dimension to the traditional gallery with several data analysis features. It allows users to enjoy these artworks at home or from anywhere, and serves an educational and research purpose. The web app supports artwork display, search by user-input keywords and selection filters, data analysis etc. We hope our virtual site experience could encourage people to make physical tours to NGA, which will definitely complement them with a more holistic perceptual experience of these artworks.


## Local Setup
	
| Command     | Description |
| -------     | ----------  |
| `npm install` | Install the dependencies for server/ client |
| `npm start` | Start server/ client |


## Features

### 1. Geographic Distribution of Artwork Origins
&nbsp;
![1](https://github.com/lingzix/Demo_gif/blob/main/Map.gif)

### 2. Search by selection filters
&nbsp;
![2](https://github.com/lingzix/Demo_gif/blob/main/Filter_search.gif)

### 3. Search by user-input keywords
&nbsp;
![3](https://github.com/lingzix/Demo_gif/blob/main/Keyword_search.gif)

### 4. Search by user height/birth year
&nbsp;
User can find artworks with the same height as themselves, or were created within the year they were born.

![4](https://github.com/lingzix/Demo_gif/blob/main/Naughty_search.gif)

### 5. Artwork Detail & Similar Artworks
&nbsp;
Detail is dynamically fetched from our database instance. A section of color palette is automatically generated based on each artwork for aesthetic inspirations. 4 similar artworks are recommended to users at the bottom. The algorithm utilizes the facts of shared artists/exhibition/style/theme/etc. Users can continue exploring similar artworks by a simple click.

![5](https://github.com/lingzix/Demo_gif/blob/main/Artwork_similar.gif)

### 6. Word cloud
&nbsp;
User can view frequency of each keyword by hovering the mouse over the cloud.

![6](https://github.com/lingzix/Demo_gif/blob/main/Word_cloud.gif)

### 7. Collections by style
&nbsp;
![7](https://github.com/lingzix/Demo_gif/blob/main/Collection.gif)

### 8. Portraits across time
&nbsp;
Loads 6 portraits initially, each from a century between 1400 - 2000. A shuffle button allows users to shuffle and load new portraits from each century. The purpose is for users to get a glimpse of the historical evolution of portrait painting styles over time.

![8](https://github.com/lingzix/Demo_gif/blob/main/Portraits.gif)

### 9. Distribution by type
&nbsp;
Users can select a term type from the menu (eg. style/school/theme/technique/keyword/place), and the chart will return the most common terms within that type.

![9](https://github.com/lingzix/Demo_gif/blob/main/Bar_chart.gif)
