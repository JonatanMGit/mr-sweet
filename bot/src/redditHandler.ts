export async function getImagesFromPost(postURL: String): Promise<String[] | undefined> {
    try {
        //console.log(postURL);
        // validate that it is a reddit post
        if (!postURL.includes("reddit.com/r/")) {
            console.log("not a reddit post");
            return undefined;
        }
        const response = await fetch(postURL + ".json", {
            method: 'GET',
            headers: {
                'User-Agent': 'Mr Sweet',
            }
        });
        // console.log(response.url);


        let json = await response.json()



        // console.log(json);

        json = json[0].data.children[0].data;

        let images: String[] = [];

        if (json.is_gallery) {
            //console.log(json.media_metadata)
            for (const image in json.gallery_data.items) {
                const media_id = json.gallery_data.items[image].media_id;
                console.log(media_id);
                images.push("https://i.redd.it/" + media_id + "." + json.media_metadata[media_id].m.split("/")[1]);
            }

            return images;
        }

        console.log("not a gallery");


        return undefined;
    }
    catch (error) {
        console.error(error);
        return undefined;
    }
}
