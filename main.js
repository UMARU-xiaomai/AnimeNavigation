var animeList;
var customWebsites;

UpdateTheList();

function UpdateTheList()
{
	animeList = JSON.parse(getCookie("anime_list")).contents;
	customWebsites = JSON.parse(getCookie("custom_websites")).contents;

	
	for (i=0;i<animeList.length;i++)
	{
		let defaultWebsite = animeList[i].defaultWebsite;
		
		var targetWebsite = searchWebsite(defaultWebsite);
		if(!targetWebsite)
		{
			for(j=0;j<animeList.ref.length&&!targetWebsite;j++)
			{
				targetWebsite = searchWebsite(animeList.ref[j].name);
			}
			if(!targetWebsite)
			{
				alert('Could not find avaliable website with ${animeList[i].name}');
				continue;
			}
		}
	
		var id = '';
		for (j=0;j<animeList.ref.length;j++)
		{
			if(animeList.ref[j].name == targetWebsite.name)
			{
				id = animeList.ref[j].id;
			}
		}
		if(!id)
		{
			alert('Could not find website ref with ${animeList[i].name}!');
			continue;
		}
		
		// 使用 Fetch API 获取 HTML 源代码
		fetch(targetWebsite.detailUrlFormat.replace('%url%',targetWebsite.url).replace('%id%',id))
		  .then(response => {
			if (!response.ok) {
			  throw new Error('Network response was not ok');
			}
			return response.text();
		  })
		  .then(html => {
			// 创建一个 DOMParser 实例来解析 HTML 字符串
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, 'text/html');

			// 找到目标元素并获取内容
			const episodes = doc.querySelector(targetWebsite.episodeSelector);
			const episodesCount = episodes.querySelectorAll().length;

			const updateTimeElement = doc.querySelector(targetWebsite.updateTimeSelector);
			const updateTime = updateTimeElement.textContent.trim();
		
		  })
		  .catch(error => {
			console.error('There was a problem fetching the HTML:', error);
		  });
		  
		var latestList = document.getElementById('latest_list');
		
		const curRow = latestList.insertRow();
		
		curRow.insertCell(0).textContent = (disps.length + 1).toString();
		curRow.insertCell(1).textContent = animeList[i];
		curRow.insertCell(2).textContent = updateTime;
		curRow.insertCell(3).textContent = animeList.lastWatch.toString();
		curRow.insertCell(4).textContent = episodesCount.toString();
	}
	document.getElementById('last_update_time').innerText = "上次更新时间："+Date();
}


//查找website
function searchWebsite(name)
{
	var res = null;
	if (customWebsites)
	{
		for (j=0;j<customWebsites.length;j++)
		{
			if(name == customWebsites[j].name)
			{
				res = customWebsites[j];
				break;
			}
		}
	}
	//TODO:获取内置网址组（从JSON文件）
	return res;
}

function test_one()
{
	document.cookie='lastname=Smith';
	setCookie('anime_list',`{
	"contents":
	[
	{
		"name":"干物妹！小埋",
		"updateTime":"2018",
		"globalId":0,
		"lastWatch":6,
		"defaultWebsite":"wedmcc",
		"ref":
		[
		{
			"name":"wedmcc",
			"id":1521
		}
		]
		
	}
	]
}`,1);
}

//Cookie操作
function setCookie(cname,cvalue,exdays){
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname+"="+cvalue+";"+expires;

}
function getCookie(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
    }
    return "";
}