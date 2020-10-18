


function tokenizeVideo(md,options) {
  return (tokens,idx)=>{
    const videoID = md.utils.escapeHtml(tokens[idx].videoID);
    const service = md.utils.escapeHtml(tokens[idx].service).toLowerCase();

    if (videoID==='') return '';

    const embedURL = `https://www.youtube-nocookie.com/embed/${videoID}?rel=0`;
    const pageURL  = `https://www.youtube.com/watch?v=${videoID}`;
    const imageURL = `https://img.youtube.com/vi/${videoID}/0.jpg`

    if (options.acceptYoutube) {
      return `
<div class="embed-responsive embed-responsive-16by9">
  <iframe
    class="embed-responsive-item ${service}-player"
    type="text/html"
    width="${options[service].width}"
    height="${options[service].height}"
    src="${embedURL}"
    frameborder="0"
    webkitallowfullscreen mozallowfullscreen allowfullscreen>
  </iframe>
</div>`;
    }
    else {
      return `
<div class="without-accept-youtube">
  <img src="${imageURL}"/>
  <a href="${pageURL}" target="_blank">${pageURL}</a><br/>
  <small>to view videos directly on this page, your <a href="/cookies">consent</a> is necessary.</small>
</div>`;
    }
  }
}

const EMBED_REGEX = /@\[([a-zA-Z].+)]\([\s]*(.*?)[\s]*[)]/im;

function videoEmbed(md,options) {
  return (state, silent) =>{
    const oldPos = state.pos;

    if (state.src.charCodeAt(oldPos) !== 0x40/* @ */ ||
      state.src.charCodeAt(oldPos + 1) !== 0x5B/* [ */) {
      return false;
    }

    const match = EMBED_REGEX.exec(state.src.slice(state.pos, state.src.length));
    if (!match || match.length < 3) {
      return false;
    }

    const service = match[1];
    var videoID = match[2];
    const serviceLower = service.toLowerCase();

    if (videoID === ')') {
      videoID = '';
    }

    const serviceStart = oldPos + 2;
    const serviceEnd = md.helpers.parseLinkLabel(state, oldPos + 1, false);

    //
    // We found the end of the link, and know for a fact it's a valid link;
    // so all that's left to do is to call tokenizer.
    //
    if (!silent) {
      state.pos = serviceStart;
      state.service = state.src.slice(serviceStart, serviceEnd);
      const newState = new state.md.inline.State(service, state.md, state.env, []);
      newState.md.inline.tokenize(newState);

      const token = state.push('video', '');
      token.videoID = videoID;
      token.service = service;
      token.url = match[2];
      token.level = state.level;
    }

    state.pos += state.src.indexOf(')', state.pos);
    return true;
  }
}

const defaults = {
  youtube: { width: 640, height: 390, nocookie: false },
  vimeo: { width: 500, height: 281 },
  vine: { width: 600, height: 600, embed: 'simple' },
  prezi: { width: 550, height: 400 },
  osf: { width: '100%', height: '100%' },
};

function plugin(md, options) {
  var fullOptions = {
    ...defaults,
    ...options
  };


  md.renderer.rules.video = tokenizeVideo(md, fullOptions);
  md.inline.ruler.before('emphasis', 'video', videoEmbed(md, fullOptions));
};

export default plugin
