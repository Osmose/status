import errno
import os
import SimpleHTTPServer
import SocketServer
import time
from threading import Thread

from fabric.api import task
from jinja2 import Environment, FileSystemLoader
from watchdog.events import PatternMatchingEventHandler
from watchdog.observers import Observer


env = Environment(autoescape=True, loader=FileSystemLoader('./'))


class FileChangeEventHandler(PatternMatchingEventHandler):
    def on_any_event(self, event):
        print 'Files have changed. Rebuilding...',
        build()
        print 'Done'


@task
def build():
    index = env.get_template('index.html')

    # Create build directory if it doesn't exist.
    try:
        os.makedirs('_build')
    except OSError as e:
        # Reraise if the error isn't that the directory exists.
        if e.errno != errno.EEXIST:
            raise

    with open(os.path.join('_build', 'index.html'), 'w') as f:
        f.write(index.render())


@task
def serve():
    build()
    os.chdir('_build')

    monitor_thread = Thread(target=monitor)
    monitor_thread.start()

    handler = SimpleHTTPServer.SimpleHTTPRequestHandler
    httpd = SocketServer.TCPServer(("", 8000), handler)
    print "Serving at port", 8000
    httpd.serve_forever()


@task
def monitor():
    observer = Observer()
    handler = FileChangeEventHandler(patterns=['assets/*', 'index.html'])
    observer.schedule(handler, '.', recursive=True)
    print "Monitoring for changes..."
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
