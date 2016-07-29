client = Twitter::REST::Client.new do |config|
  config.consumer_key    = "GFuRhtnpK9u12ZNrYxEHbetjC"
  config.consumer_secret = "DMJ9FZqz4NMOi4SIfNBVgqyYv4Fksex3gmRhfOqO7Wk6DSs8J5"
end

def client.get_latest_tweet(username)
  options = {count: 1, include_rts: true}
  user_timeline(username, options)[0].text
end


get "/" do
  erb :game
end

post "/tweets" do
  if request.xhr?
    tweet = client.get_latest_tweet(params[:username])
    profile_image = client.user("realDonaldTrump").profile_image_uri
    return {dialogue: tweet, portrait: profile_image}.to_json
  else
    halt(403, "Nothing to see here.")
  end
end
