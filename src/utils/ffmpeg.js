import * as ffmpeg from 'fluent-ffmpeg'

export const convertVideo = (path, output_name, cb, cb_params) => {
  try {
    const command = ffmpeg(path)
      .noAudio()
      .fps(60)('16:9')
      .duration(5)
      .format('mp4')
      .on('progress', function(progress) {
        console.log('[ffmpeg] Processing: ' + progress.percent + '% done');
        if (Number(progress.percent) === 100) {
          cb([...cb_params])
        }
      })
      on('stderr', function(stderrLine) {
        console.log('[ffmpeg] Stderr output: ' + stderrLine);
      })
      .on('end', function(stdout, stderr) {
        console.log('[ffmpeg] Transcoding succeeded !', stdout, stderr);
      })
      .save(`/uploads/${output_name}.mp4`)
      .run()

    console.log(command);
  } catch (e) {
    console.log(e);
    cb([...cb_params], e)
    throw new Error(e)
  }
}
