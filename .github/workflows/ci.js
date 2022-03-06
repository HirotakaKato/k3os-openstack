module.exports = async (github, context) => {
  const owner = context.repo.owner;
  const repo  = context.repo.repo;

  const {data: {id: releaseId}} = await github.rest.repos.createRelease({
    owner:    owner,
    repo:     repo,
    tag_name: `v${process.env.VERSION}`,
  });

  const filename = process.env.FILENAME;
  const data     = require('fs').readFileSync(filename);

  github.rest.repos.uploadReleaseAsset({
    owner:      owner,
    repo:       repo,
    release_id: releaseId,
    name:       filename,
    data:       data,
  });

  const crypto = require('crypto');
  const sha256 = crypto.createHash('sha256').update(data).digest('hex');
  const md5    = crypto.createHash('md5').update(data).digest('hex');

  github.rest.repos.uploadReleaseAsset({
    owner:      owner,
    repo:       repo,
    release_id: releaseId,
    name:       'checksums.txt',
    data:       `sha256: ${sha256}  ${filename}\nmd5: ${md5}  ${filename}\n`,
  });
};
